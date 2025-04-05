import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string } | null>(null)
  
  useEffect(() => {
    const userData = localStorage.getItem("cred_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return <p className="text-center p-8 text-gray-500">Loading user dashboard...</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">👋 Welcome, {user.name}</h1>
      <p className="text-lg text-gray-600 mb-6">Here's your verified credential dashboard.</p>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Your Credentials (Sample)</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>🎓 B.Tech - Computer Science, XYZ University (Verified)</li>
          <li>💼 Software Engineer at ABC Corp (Verified)</li>
          <li>📜 Blockchain Certificate - Algorand Foundation (Pending)</li>
        </ul>
      </div>
    </div>
  );
}