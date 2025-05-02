// src/components/Layout.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet'

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { account, connect, disconnect } = useWallet()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-6">CredChain</h2>
        <nav className="space-y-3">
          <Link to="/dashboard" className="block hover:text-indigo-300">🏠 Dashboard</Link>
          <Link to="/documents" className="block hover:text-indigo-300">📁 My Documents</Link>
          <Link to="/verify" className="block hover:text-indigo-300">✅ Verify</Link>
          <Link to="/about" className="block hover:text-indigo-300">📤 About</Link>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("cred_user")
            navigate("/login")
          }}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main content with Wallet header */}
      <div className="flex-1 bg-gray-100">
        <div className="flex justify-end p-4 border-b bg-white">
          {account ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-800 font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
              <button
                onClick={disconnect}
                className="text-sm text-red-500 hover:underline"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          )}
        </div>

        <main className="flex-1 bg-gray-100 p-8">{children}</main>
      </div>
    </div>
  )
}





