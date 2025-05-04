// src/hooks/useSmartContract.ts
import { useWallet, peraWallet } from './useWallet'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { CredchainContractFactory } from '../contracts/CredchainContract' // your generated arc56 client
import 'dotenv/config'
// import algosdk, { Indexer } from 'algosdk'

export const useSmartContract = () => {
  const { signer } = useWallet()

  const sayHello = async (name: string) => {
    // 1. Force Pera to pop the connect UI if needed:
    const accounts = await peraWallet.reconnectSession().then(a => a.length ? a : peraWallet.connect())
    const account = accounts[0]
    if (!account || !signer) {
      alert('Please connect your wallet first.')
      return
    }

    // // 2) build a TestNet Algod+Indexer pair by hand
    // const algodClient   = new algosdk.Algodv2(
    //   '', 
    //   'https://testnet-api.algonode.cloud', 
    //   ''
    // )
    // const indexerClient = new Indexer(
    //   '', 
    //   'https://testnet-idx.algonode.cloud', 
    //   ''
    // )

    // // 3) wrap them in an AlgorandClient
    // const algod = AlgorandClient.fromClients({
    //   algod:   algodClient,
    //   indexer: indexerClient
    // })

    const algod = AlgorandClient.defaultLocalNet()

    // 2️⃣ Grab the same account you used to deploy
    // Algokit’s KMD already holds DEPLOYER
    const deployer = await algod.account.fromEnvironment('DEPLOYER')
    console.log('→ using', deployer.addr)

    // // 2. Build a TestNet client from your .env
    // const algod = AlgorandClient.fromEnvironment() // connect to TestNet
    // console.log(algod.account) // for debugging

    // 3. Wire up your factory with your TestNet account + signer
    const factory = algod.client.getTypedAppFactory(
      CredchainContractFactory,
      { defaultSender: account, defaultSigner: signer }
    )

    // 4. Attach to the TestNet app you just deployed
    // src/hooks/useSmartContract.ts
    // const raw = import.meta.env.VITE_APP_ID
    // if (!raw) {
    //   throw new Error("VITE_APP_ID is not defined in .env")
    // }
    // const appId = BigInt(raw)        // now raw === "1012"
    const client = await factory.getAppClientById({ appId: 1006n })


    // 5. Call your hello() method
    const { return: greeting } = await client.send.hello({ args: { name } })
    console.log('📣 TestNet contract says:', greeting)
    return greeting
  }

  return { sayHello }
}
