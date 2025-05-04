// src/routes/digilocker.ts

import { Router, Request, Response } from 'express'
import { buildMerkleTree, signRoot } from '../utils/merkle'
import { mintMerkleNFT }       from '../chain/merkleNFT'
import { DocumentModel }       from '../models/documentModel'

const router = Router()

// In-route “mock DigiLocker DB”
const mockDocs = [
  {
    userId:      'alice123',
    docId:       'DOC123',
    description: 'Class 12 Marksheet',
    docType:     '12MARKSHEET',
    issueDate:   new Date('2022-05-12'),
    issuerId:    'CBSE2022',
    orgId:       '002317',
    orgName:     'CBSE Board',
    parameters:  { rollNumber: '123456', centerCode: '110078' },
    udf1:         'PAN123456',
    verified:    true,
  },
  {
    userId:      'alice123',
    docId:       'DOC456',
    description: 'Graduation Certificate',
    docType:     'DEGREE',
    issueDate:   new Date('2024-06-30'),
    issuerId:    'XYZUNI1234',
    orgId:       '008800',
    orgName:     'XYZ University',
    parameters:  { enrollmentNo: 'UG20201234' },
    verified:    false,
  },
]

/**
 * POST /documents/digilocker
 * Body JSON:
 *   { userId: string, documentId: string }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, documentId } = req.body as {
      userId: string
      documentId: string
    }

    if (!userId || !documentId) {
      res.status(400).json({ error: 'userId + documentId required' })
      return
    }

    // 1️⃣ Look up the mock record
    const mock = mockDocs.find(
      (d) => d.userId === userId && d.docId === documentId
    )
    if (!mock) {
      res.status(404).json({ error: 'Document not found in mock DigiLocker' })
      return
    }

    // 2️⃣ Flatten only string‐valued fields for Merkle
    const data: Record<string, string> = {
      docId:       mock.docId,
      description: mock.description,
      docType:     mock.docType,
      issueDate:   mock.issueDate.toISOString(),
      issuerId:    mock.issuerId,
      orgId:       mock.orgId,
      orgName:     mock.orgName,
      // add more if desired...
    }

    // 3️⃣ Build Merkle tree
    const { root, leafMap } = buildMerkleTree(data)
    const rootHex = root.toString('hex')

    // ✨ turn each sibling‐buffer list into an array of hex‐strings ✨
    const proofsHex: Record<string,string[]> = {}
    for (const [field, siblings] of Object.entries(leafMap)) {
    // siblings is Uint8Array[] (or Buffer[])
    proofsHex[field] = Array.isArray(siblings) ? siblings.map((sib) => {
        if (Buffer.isBuffer(sib)) {
            return sib.toString('hex');
        }
        return Buffer.from(sib as unknown as Uint8Array).toString('hex');
    }) : [];
    }


    // 4️⃣ Sign the root
    const sigB64 = signRoot(root, process.env.DEPLOYER_MNEMONIC!)

    // 5️⃣ Mint the ASA-NFT on LocalNet
    let assetId: number
    try {
      assetId = await mintMerkleNFT(rootHex, Object.keys(data))
    } catch (err: any) {
      console.error('⚠️ mintMerkleNFT failed:', err)
      res
        .status(500)
        .json({ error: 'On-chain mint failed', detail: err.message })
      return
    }

    // 6️⃣ Persist on-chain ASA info + proof metadata in Mongo
    const doc = await DocumentModel.create({
      userId,
      type:    'digilocker',
      rawData: mock,    // store full mock payload
      assetId,
      meta: {
        rootHex,
        sigB64,
        fields: Object.keys(data),
      },
    })

    // 7️⃣ Return to client
    res.status(201).json({
      document:        doc,
      proofsAvailable: Object.keys(data),
      proofs: leafMap,
      proofsHex,
    })
    return

  } catch (err: any) {
    console.error('POST /documents/digilocker error', err)
    res.status(500).json({ error: 'DigiLocker upload failed', detail: err.message })
    return
  }
})

export default router
