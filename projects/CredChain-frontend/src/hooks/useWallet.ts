// src/hooks/useWallet.ts
import { useState, useEffect } from 'react'
import { PeraWalletConnect } from '@perawallet/connect'

const peraWallet = new PeraWalletConnect()

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) setAccount(accounts[0])
    })
  }, [])

  const connect = async () => {
    const accounts = await peraWallet.connect()
    setAccount(accounts[0])
  }

  const disconnect = () => {
    peraWallet.disconnect()
    setAccount(null)
  }

  return { account, connect, disconnect } // ✅ no signer
}