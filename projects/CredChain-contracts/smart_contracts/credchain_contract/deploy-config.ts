// projects/CredChain-contracts/smart_contracts/credchain_contract/deploy-config.ts

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { CredchainContractFactory } from '../artifacts/credchain_contract/CredchainContractClient'

export async function deploy() {
  console.log('=== Deploying CredchainContract on LocalNet ===')

  // 1️⃣ Point at LocalNet (sandbox)
  const algorand = AlgorandClient.defaultLocalNet()

  // 2️⃣ Pull in the built-in sandbox account "DEPLOYER"
  const deployer = await algorand.account.fromEnvironment('DEPLOYER')
  console.log('→ using deployer:', deployer.addr)

  // 3️⃣ Wire up your typed‐app factory
  const factory = algorand.client.getTypedAppFactory(
    CredchainContractFactory,
    {
      defaultSender: deployer.addr,
      defaultSigner: deployer.signer
    }
  )

  // 4️⃣ Idempotent deploy / upgrade
  const { appClient, result } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append'
  })

  // 5️⃣ If brand-new, seed it with 1 ALG O so it can hold funds
  if (['create', 'replace'].includes(result.operationPerformed)) {
    console.log('→ Funding app account with 1 ALGO')
    await algorand.send.payment({
      amount: 1 .algo(),
      sender: deployer.addr,
      receiver: appClient.appAddress
    })
  }

  // 6️⃣ Smoke-test your hello() method
  const { return: greeting } = await appClient.send.hello({ args: { name: 'LocalNet' } })
  console.log(`✅ app ${appClient.appClient.appId} says:`, greeting)
}

// Allow `npx ts-node deploy-config.ts` to just work:
if (require.main === module) {
  deploy()
    .then(() => console.log('✅  Done.'))
    .catch((err) => {
      console.error('🚨  Deployment failed:', err)
      process.exit(1)
    })
}
