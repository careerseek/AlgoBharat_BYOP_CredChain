// src/components/Layout.tsx
import { Link, useNavigate } from 'react-router-dom';
import WalletDemo from './WalletDemo'

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

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
          {/* Swap out manual buttons for your demo component */}
          <WalletDemo />
        </div>

        <main className="flex-1 bg-gray-100 p-8">{children}</main>
      </div>
    </div>
  )
}





