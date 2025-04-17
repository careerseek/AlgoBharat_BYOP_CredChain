// src/pages/About.tsx
import Layout from '../components/Layout';

export default function About() {
  return (

    <div className="max-w-3xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">ℹ️ About CredChain</h1>
    <p className="text-gray-600 mb-4">
        CredChain is a decentralized credential verification platform that enables users to securely manage, share, and verify their personal documents.
    </p>

    <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>🔒 Connect DigiLocker to sync your verified government-issued documents.</li>
        <li>📤 Upload documents manually to verify them using blockchain hashing.</li>
        <li>🏛 Institutions can verify and issue certificates directly to users on-chain.</li>
    </ul>

    <p className="mt-6 text-gray-500 text-sm">
        Built with ❤️ for the Web3 future of identity.
    </p>
    </div>

  );
}