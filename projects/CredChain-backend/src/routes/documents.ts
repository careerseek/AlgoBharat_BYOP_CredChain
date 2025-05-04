// projects/CredChain-backend/src/routes/documents.ts

import { Router, Request, Response } from 'express'
import multer from 'multer'
import { buildMerkleTree, signRoot } from '../utils/merkle'
import { mintMerkleNFT } from '../chain/merkleNFT'
import { DocumentModel } from '../models/documentModel'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

/**
 * POST /documents/self
 * Body (JSON): { userId, data: { name: "...", dob: "...", id: "..." } }
 */
router.post(
  '/',
  upload.none(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, data } = req.body as {
        userId: string
        data: Record<string, string>
      }

      if (!userId || !data) {
        res.status(400).json({ error: 'userId + data required' })
        return
      }

      // 1️⃣ Build the Merkle tree + get the map of leaf‐sibling lists
      const { root, leafMap } = buildMerkleTree(data)
      const rootHex = root.toString('hex')

        // 2️⃣ Turn each leaf‐hash Buffer into a hex‐string (wrapped in a 1-element array)
        const proofs: Record<string, string[]> = {}
        const leafMapBuffers = leafMap as Record<string, Buffer>
        for (const [field, buf] of Object.entries(leafMapBuffers)) {
        proofs[field] = [ buf.toString('hex') ]
        }


      // 3️⃣ Sign the root
      const sigB64 = signRoot(root, process.env.DEPLOYER_MNEMONIC!)

      // 4️⃣ Mint an ASA-NFT embedding that metadata
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

      // 5️⃣ Persist on-chain info in Mongo
      const doc = await DocumentModel.create({
        userId,
        type: 'self',
        rawData: null,
        assetId,
        meta: {
          rootHex,
          sigB64,
          fields: Object.keys(data),
        },
      })

      // 6️⃣ Return DB record + available fields + the hex-proofs
      res.status(201).json({
        document: doc,
        proofsAvailable: Object.keys(data),
        proofs,
      })
    } catch (err: any) {
      console.error('POST /documents/self error', err)
      res.status(500).json({ error: 'Self-upload failed' })
    }
  }
)

export default router
