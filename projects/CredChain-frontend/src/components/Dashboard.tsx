import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("cred_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cred_user");
    navigate("/login");
  };

  if (!user) {
    return <p className="text-center p-8 text-gray-500">Loading user dashboard...</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          👋 Welcome, {user.name}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <p className="text-lg text-gray-600 mb-6">
        Here's your verified credential dashboard.
      </p>

      {/* Credentials */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Your Credentials (Sample)
        </h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>🎓 B.Tech - Computer Science, XYZ University (Verified)</li>
          <li>💼 Software Engineer at ABC Corp (Verified)</li>
          <li>📜 Blockchain Certificate - Algorand Foundation (Pending)</li>
        </ul>
      </div>
    </div>
  );
}