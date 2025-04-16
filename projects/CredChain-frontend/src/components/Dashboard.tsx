import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<{ id: string; name: string; digilockerLinkedAt?: string | null;} | null>(null);
  const [digilockerLinked, setDigilockerLinked] = useState(false);
  const navigate = useNavigate();

  // Fetch updated user data from backend
  const fetchUserStatus = async (userId: string) => {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            getUser(id: "${userId}") {
              id
              name
              digilockerLinked
              digilockerLinkedAt
            }
          }
        `,
      }),
    });

    const result = await response.json();
    const updatedUser = result.data?.getUser;
    if (updatedUser) {
      setDigilockerLinked(updatedUser.digilockerLinked);
      setUser({
        id: updatedUser.id,
        name: updatedUser.name,
        digilockerLinkedAt: updatedUser.digilockerLinkedAt,
      });
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("cred_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      fetchUserStatus(parsed.id);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cred_user");
    navigate("/login");
  };


  const handleDisconnect = async () => {
    if (!user) return;
    await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation {
            unlinkDigilocker(userId: "${user.id}") {
              id
              digilockerLinked
            }
          }
        `,
      }),
    });
    setDigilockerLinked(false);
  };

  if (!user) {
    return <p className="text-center p-8 text-gray-500">Loading user dashboard...</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">👋 Welcome, {user.name}</h1>
        <div className="flex flex-col items-end space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          {digilockerLinked ? (
            <button
              onClick={handleDisconnect}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
            >
              Disconnect DigiLocker
            </button>
          ) : (

            <button
              onClick={() => navigate('/digilocker/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Connect DigiLocker
            </button>
            
          )}
          {digilockerLinked && user.digilockerLinkedAt && (
            <p className="text-sm text-gray-600 mt-1">
              📅 DigiLocker linked on:{" "}
              <span className="font-medium">
                {new Date(user.digilockerLinkedAt).toLocaleString()}
              </span>
            </p>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      <p className="text-lg text-gray-600 mb-6">
        Here's your verified credential dashboard.
      </p>

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