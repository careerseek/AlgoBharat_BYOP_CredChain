export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Single Navbar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-400">
              CredChain <span>⬡</span>
            </a>
          </div>
          <div className="flex space-x-6">
            <a href="/" className="text-blue-400 font-medium">Home</a>
            <a href="/login" className="text-gray-400 hover:text-white transition-colors duration-300">Login</a>
            <a href="/signup" className="text-gray-400 hover:text-white transition-colors duration-300">Signup</a>
          </div>
        </div>
      </nav>

      {/* Main content - with flex-grow to push footer down */}
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero section */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-blue-400">
              Secure, Fast, and Transparent<br />
              Credential Verification
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              CredChain leverages blockchain technology, Aadhaar integration, and DigiLocker to provide trusted
              credential verification.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="mb-4 text-yellow-500 text-xl">🔒</div>
              <h2 className="text-xl font-semibold text-white mb-3">Secure Storage</h2>
              <p className="text-gray-400">
                Immutable storage of credentials using blockchain technology ensures your data remains tamper-proof.
              </p>
            </div>

            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="mb-4 text-yellow-500 text-xl">⚡</div>
              <h2 className="text-xl font-semibold text-white mb-3">Instant Verification</h2>
              <p className="text-gray-400">
                Rapid verification processes significantly reduce time and cost with our optimized protocols.
              </p>
            </div>

            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="mb-4 text-yellow-500 text-xl">🛡️</div>
              <h2 className="text-xl font-semibold text-white mb-3">Enhanced Privacy</h2>
              <p className="text-gray-400">
                Zero-Knowledge Proof technology ensures complete data privacy while maintaining verification integrity.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <a
              href="/signup"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300"
            >
              Get Started
            </a>
          </div>
        </div>
      </main>

      {/* Footer - now will stick to bottom */}
      <footer className="border-t border-gray-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          © 2025 CredChain. All rights reserved.
        </div>
      </footer>
    </div>
  );
}