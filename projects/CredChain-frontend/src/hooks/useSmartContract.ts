
import { CredchainContractClient } from '../../../CredChain-contracts/smart_contracts/artifacts/credchain_contract/CredchainContractClient'
import { useWallet } from './useWallet'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

export const useSmartContract = () => {
  const { account } = useWallet()

  const sayHello = async (name: string) => {
    if (!account) {
      alert("Wallet not connected.")
      return
    }

    const algod = AlgorandClient.defaultLocalNet() // or use `fromEnvironment()` if set up

    const client = new CredchainContractClient({
      appId: BigInt(YOUR_APP_ID), // replace with your app ID
      algorand: algod,
      defaultSender: account,     // this is valid here
    })

    // 3. Call the hello method
    const result = await client.send.hello({ args: { name } })

    console.log("Smart contract response:", result.return)
    return result.return
  }

  return { sayHello }
}
