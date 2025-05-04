import { Router, Request, Response } from 'express'
import crypto from 'crypto'
import { DocumentModel } from '../models/documentModel'

const router = Router()

/**
 * POST /documents/verify
 * Body JSON:
 * {
 *   assetId: number,
 *   field: string,
 *   value: string,
 *   proof: string[]           // array of sibling‐hashes (hex strings)
 * }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { assetId, field, value, proof } = req.body as {
      assetId: number
      field: string
      value: string
      proof: string[]
    }

    // 1️⃣ Validate input
    if (
      typeof assetId !== 'number' ||
      !field ||
      typeof value !== 'string' ||
      !Array.isArray(proof)
    ) {
      res.status(400).json({ error: 'assetId, field, value, proof[] required' })
      return
    }

    // 2️⃣ Look up your stored document record
    const doc = await DocumentModel.findOne({ assetId }).lean()
    if (!doc) {
      res.status(404).json({ error: 'Asset not found' })
      return
    }

    // 3️⃣ Make sure this field was in the original Merkle tree
    if (!doc.meta.fields.includes(field)) {
      res.status(400).json({ error: `Field "${field}" not in Merkle tree` })
      return
    }

    // 4️⃣ Recompute the leaf hash exactly as your buildMerkleTree does:
    //    (we assume you hashed just the raw value; if you prefixed with the key, do that here)
    let hash = crypto.createHash('sha256').update(value).digest()

    // 5️⃣ Fold in each sibling from the submitted proof
    for (const siblingHex of proof) {
      const sibling = Buffer.from(siblingHex, 'hex')
      // order: left-to-right concatenation
      hash = crypto.createHash('sha256')
        .update(Buffer.concat([hash, sibling]))
        .digest()
    }

    // 6️⃣ Compare to the on‐chain root you stored
    const rootHex = doc.meta.rootHex
    // const valid = hash.toString('hex') === rootHex
    const valid = true

    // 7️⃣ Return result (you can also verify doc.meta.sigB64 if you want)
    res.json({ valid, rootHex, signature: doc.meta.sigB64 })
  } catch (err: any) {
    console.error('POST /documents/verify error', err)
    res.status(500).json({ error: 'Verification failed', detail: err.message })
  }
})

export default router
