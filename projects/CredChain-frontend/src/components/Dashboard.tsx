import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("cred_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    }
  }, []);

  if (!user) {
    return <p className="text-center p-8 text-gray-500">Loading user dashboard...</p>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      <h1 className="text-2xl font-bold mb-4">Welcome to CredChain</h1>

      
      {/* Hero Banner */}
      <div className="flex items-center justify-between bg-blue-50 rounded-xl p-8 mb-10 shadow-md">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">👋 Welcome, {user.name}</h1>
          <p className="text-gray-700 max-w-xl">
            CredChain is your trusted platform to upload, verify, and share your personal and institutional documents.
            Start by uploading your documents, fetching from DigiLocker, or requesting verification from an institute.
          </p>
        </div>
        <img
          src="/imgs/hero-docs.png"
          alt="CredChain Docs"
          className="w-48 h-48 object-contain hidden sm:block"
        />
      </div>

      {/* Get Your Documents Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📥 Get Your Documents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div onClick={() => navigate('/get/self')} className="bg-white rounded-lg p-6 shadow hover:shadow-lg cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📤 Self Upload</h3>
            <p className="text-sm text-gray-600">Upload documents directly from your system. Fill in key details and submit for verification.</p>
          </div>
          <div onClick={() => navigate('/get/digilocker')} className="bg-white rounded-lg p-6 shadow hover:shadow-lg cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🔗 DigiLocker Import</h3>
            <p className="text-sm text-gray-600">Fetch verified government-issued documents via DigiLocker integration.</p>
          </div>
          <div onClick={() => navigate('/get/institute')} className="bg-white rounded-lg p-6 shadow hover:shadow-lg cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🏛️ From Institutes</h3>
            <p className="text-sm text-gray-600">Request documents from educational or organizational bodies and track their status.</p>
          </div>
        </div>
      </section>

      {/* Recent Documents */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">🕑 Recent Documents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow text-gray-600">No recent documents to show.</div>
        </div>
      </section>
    </div>
  );
}