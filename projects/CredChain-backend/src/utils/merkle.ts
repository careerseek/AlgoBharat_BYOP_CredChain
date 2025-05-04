// projects/CredChain-backend/src/utils/merkle.ts
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import algosdk from 'algosdk'

/** 
 * Given a plain object of `{ fieldName: stringValue }`,
 * returns { rootHex, leaves: Buffer[], tree, leafMap }
 */
export function buildMerkleTree(data: Record<string,string>) {
  // 1. Build each leaf = keccak256(fieldName + ":" + value)
  const entries = Object.entries(data)
  const leaves = entries.map(
    ([k,v]) => keccak256(`${k}:${v}`)
  )
  // 2. Merkle Tree (sort pairs)
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
  const root = tree.getRoot()              // Buffer
  // 3. Map field → leaf Buffer for proofs
  const leafMap = Object.fromEntries(entries.map(([k], i) => [k, leaves[i]]))
  return { root, tree, leafMap }
}

/**
 * Sign a Merkle root using an Algorand private key (mnemonic).
 * Returns base64 signature.
 */
export function signRoot(root: Buffer, mnemonic: string): string {
  const { sk } = algosdk.mnemonicToSecretKey(mnemonic)
  const sigUint8 = algosdk.signBytes(root, sk)
  return Buffer.from(sigUint8).toString('base64')
}
