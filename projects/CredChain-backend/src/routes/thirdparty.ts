// projects/CredChain-backend/src/routes/thirdparty.ts

import { Router, Request, Response } from 'express'
import { buildMerkleTree, signRoot } from '../utils/merkle'
import { mintMerkleNFT }       from '../chain/merkleNFT'
import { DocumentModel }       from '../models/documentModel'

const router = Router()

// 🚨 In‐route “mock third‐party” DB
const thirdpartyMocks = [
  {
    userId:      'alice123',
    docId:       'UNIV2025',
    description: 'B.Tech Degree Certificate',
    docType:     'DEGREE',
    issueDate:   new Date('2025-04-15'),
    issuerId:    'IITM2025',
    orgId:       'IITM',
    orgName:     'IIT Madras',
    parameters:  { major: 'Computer Science' },
    verified:    true,
  },
  // …add more as needed
]

/**
 * POST /documents/thirdparty
 * Body JSON: { userId, documentId }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, documentId } = req.body as {
      userId: string
      documentId: string
    }
    // 1️⃣ Validate
    if (!userId || !documentId) {
      res.status(400).json({ error: 'userId + documentId required' })
      return
    }
    // 2️⃣ Lookup mock record
    const mock = thirdpartyMocks.find(
      (d) => d.userId === userId && d.docId === documentId
    )
    if (!mock) {
      res.status(404).json({ error: 'Document not found' })
      return
    }
    // 3️⃣ Flatten to string fields
    const data: Record<string,string> = {
      docId:       mock.docId,
      description: mock.description,
      docType:     mock.docType,
      issueDate:   mock.issueDate.toISOString(),
      issuerId:    mock.issuerId,
      orgId:       mock.orgId,
      orgName:     mock.orgName,
    }
    // 4️⃣ Build Merkle tree
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


    // 5️⃣ Sign the root
    const sigB64 = signRoot(root, process.env.DEPLOYER_MNEMONIC!)
    // 6️⃣ Mint the ASA‐NFT
    let assetId: number
    try {
      assetId = await mintMerkleNFT(rootHex, Object.keys(data))
    } catch (err: any) {
      console.error('⚠️ mintMerkleNFT failed:', err)
      res
        .status(500)
        .json({ error: 'On‐chain mint failed', detail: err.message })
      return
    }
    // 7️⃣ Persist to Mongo
    const doc = await DocumentModel.create({
      userId,
      type:    'thirdparty',
      rawData: mock,
      assetId,
      meta: { rootHex, sigB64, fields: Object.keys(data) },
    })
    // 8️⃣ Reply
    res.status(201).json({
      document:        doc,
      proofsAvailable: Object.keys(data),
      proofs: leafMap,
      proofsHex,
    })
  } catch (err: any) {
    console.error('POST /documents/thirdparty error', err)
    res
      .status(500)
      .json({ error: 'Third‐party upload failed', detail: err.message })
  }
})

export default router
