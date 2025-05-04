// projects/CredChain-backend/src/chain/merkleNFT.ts
import algosdk from 'algosdk'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * Mints a 1-unit NFT (ASA) whose on-chain metadata is just the Merkle root.
 * Uses the sandbox’s KMD “DEPLOYER” account (configured via defaultLocalNet()).
 */
export async function mintMerkleNFT(
  rootHex: string,          // hex-string of Merkle root
  fields: string[]          // array of field names (kept off-chain)
): Promise<number> {
  // 1️⃣ Grab LocalNet client + KMD account
  const algorand = AlgorandClient.defaultLocalNet()
  const { algod: algodClient } = algorand.client
  const { addr, signer } = await algorand.account.fromEnvironment('DEPLOYER')

  // 2️⃣ Get suggested params
  const params = await algodClient.getTransactionParams().do()

  // 3️⃣ Only embed the Merkle root on-chain (under 96 char limit)
  const assetURL = `merkleroot:${rootHex}`

  // 4️⃣ Build the ASA-creation transaction
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    sender:          addr,
    total:           1,
    decimals:        0,
    assetName:       `DocNFT-${Date.now()}`,
    unitName:        'DOC',
    assetURL,        // now well under 96 chars
    manager:         addr,
    reserve:         addr,
    freeze:          addr,
    clawback:        addr,
    suggestedParams: params,
  })

  // 5️⃣ Sign via the KMD signer
  const signedTxns = await signer([txn], [0])

  // 6️⃣ Send, confirm, and return the new ASA ID
  const { txid } = await algodClient.sendRawTransaction(signedTxns).do()
  await algosdk.waitForConfirmation(algodClient, txid, 4)
  const ptx = await algodClient.pendingTransactionInformation(txid).do()
  return Number(ptx.assetIndex)
}
