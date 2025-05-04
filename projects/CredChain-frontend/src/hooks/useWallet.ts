// src/hooks/useWallet.ts
import { useState, useEffect } from 'react'
import { PeraWalletConnect } from '@perawallet/connect'
import { Transaction, TransactionSigner } from 'algosdk'

// const peraWallet = new PeraWalletConnect()
// force Pera onto TestNet
export const peraWallet = new PeraWalletConnect({
  chainId: 416002,        // ← TestNet chainId as a number
  shouldShowSignTxnToast: true,            // optional
})

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) setAccount(accounts[0])
    })

    // keep in sync if user disconnects or switches account
    peraWallet.connector?.on('disconnect', () => setAccount(null))
    peraWallet.connector?.on('accountChanged', (error, payload) => {
      if (error === null && Array.isArray(payload)) {
        setAccount(payload[0] || null);
      }
    })
  }, [])

  // in useWallet.ts → connect()
  const connect = async () => {
    try {
      const accounts = await peraWallet.connect()
      setAccount(accounts[0])
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'name' in err && 'message' in err && 
          err.name === 'PeraWalletConnectError' && typeof err.message === 'string' && err.message.includes('closed by user')) {
        // user cancelled, no biggie
        return
      }
      console.error('Wallet connection failed', err)
    }
  }

  

  const disconnect = () => {
    peraWallet.disconnect()
    setAccount(null)
  }

  // 👇 Correct signer function
  const signer: TransactionSigner = async (
    txnGroup: Transaction[],
    indexesToSign: number[]
  ): Promise<Uint8Array[]> => {
    const txnsToSign = indexesToSign.map((idx) => ({
      txn: txnGroup[idx],
    }));
  
    const signedTxns = await peraWallet.signTransaction([txnsToSign]);
    return signedTxns.flat().map((b64Txn) => {
      // If b64Txn is already a Uint8Array, return it, otherwise convert from base64 string
      if (b64Txn instanceof Uint8Array) {
        return b64Txn;
      } else {
        return new Uint8Array(Buffer.from(b64Txn as string, 'base64'));
      }
    });
  };
  

  return { account, connect, disconnect, signer }
}
