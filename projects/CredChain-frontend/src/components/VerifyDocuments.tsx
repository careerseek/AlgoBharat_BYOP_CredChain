// src/pages/Verify.tsx
import Layout from '../components/Layout';
import { useState } from 'react';

export default function Verify() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    alert(`Simulating upload and hash for: ${selectedFile.name}`);
    // later: call backend to hash + store to IPFS/blockchain
  };

  return (
    <div className="max-w-xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">✅ Verify Document</h1>
    <p className="text-gray-600 mb-6">
        Upload your document to generate a hash for verification and store a tamper-proof record.
    </p>

    <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="border border-gray-300 rounded w-full p-2"
        />
        {selectedFile && (
        <p className="text-sm text-gray-500">Selected: {selectedFile.name}</p>
        )}
        <button
        onClick={handleUpload}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
        Upload & Generate Hash
        </button>
    </div>
    </div>
  );
}