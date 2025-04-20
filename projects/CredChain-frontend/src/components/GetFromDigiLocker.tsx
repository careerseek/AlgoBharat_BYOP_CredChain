import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../interfaces/User';
import { UserDocument } from '../interfaces/UserDocument';
import { LayoutGrid, List as ListIcon } from 'lucide-react';

export default function GetFromDigilocker() {
  const [user, setUser] = useState<User | null>(null);
  const [isLinked, setIsLinked] = useState(false);
  const [linkedAt, setLinkedAt] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const navigate = useNavigate();
  

  useEffect(() => {
    const storedUser = localStorage.getItem('cred_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchLinkedStatus(parsed.id);
      fetchDocuments(parsed.id);
    }
  }, []);

  const fetchLinkedStatus = async (userId: string) => {
    const res = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            getUser(id: "${userId}") {
                digilockerLinked
                digilockerLinkedAt
                lastDigilockerSyncedAt

            }
          }
        `
      })
    });
    const data = await res.json();
    setIsLinked(data.data.getUser.digilockerLinked);
    setLinkedAt(data.data.getUser.digilockerLinkedAt);
    setLastSyncedAt(data.data.getUser.lastDigilockerSyncedAt);
    
  };

  const handleConnect = async () => {
    navigate('/digilocker/auth');
  };

  const fetchDocuments = async (userId: string) => {
    const res = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            getUserDocuments(userId: "${userId}") {
              docId
              description
              issueDate
              verified
            }
          }
        `,
      }),
    });
  
    const data = await res.json();
    setDocuments(data.data.getUserDocuments || []);
  };
  
  const handleImportDocs = async () => {
    if (!user) return;
  
    setLoading(true);
  
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
  
    const res = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            syncMockDocuments(userId: "${user.id}") {
              documents {
                docId
                description
                issueDate
                verified
              }
              lastSyncedAt
            }
          }
        `,
      }),
    });
  
    const data = await res.json();
    const result = data.data.syncMockDocuments;
  
    if (!result || result.documents.length === 0) {
      alert("✅ You're already up to date! No new documents found.");
      setLastSyncedAt(result.lastSyncedAt);
    } else {
      setDocuments(prev => [...prev, ...result.documents]);
      setLastSyncedAt(result.lastSyncedAt);
    }
  
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 space-y-10">

      {/* Hero Banner */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">🔗 Get Your Documents from DigiLocker</h1>
          <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
            Connect to DigiLocker to fetch and manage your verified government-issued documents securely.
          </p>
        </div>
        <img src="/imgs/hero-docs.png" alt="DigiLocker Banner" className="w-32 sm:w-44 h-auto hidden sm:block object-contain" />
      </div>

      {/* Connection/Sync Box */}
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
                {isLinked ? `Hi, ${user?.name}. Sync Your Documents` : `Hi, ${user?.name}. Connect to Your DigiLocker`}
            </h2>

            {isLinked ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
                <div className="text-green-600 text-2xl mt-1">✅</div>
                <div className="flex flex-col">
                    <p className="text-green-800 font-semibold">Connected to DigiLocker</p>
                    {linkedAt && <p className="text-sm text-gray-600">Linked on: {new Date(linkedAt).toLocaleString()}</p>}
                    {lastSyncedAt && <p className="text-sm text-gray-600">Last Synced: {new Date(lastSyncedAt).toLocaleString()}</p>}
                </div>
                </div>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
                <div className="text-yellow-500 text-2xl mt-1">⚠️</div>
                <div className="flex flex-col">
                    <p className="text-yellow-800 font-semibold">You're not connected to DigiLocker</p>
                    <p className="text-sm text-gray-600">Please connect to sync your documents securely.</p>
                </div>
                </div>
            )}

            {!isLinked ? (
            <button
                onClick={handleConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow"
            >
                Connect to DigiLocker
            </button>
            ) : (
            <button
                onClick={handleImportDocs}
                disabled={loading}
                className={`flex items-center gap-2 ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-medium px-6 py-2 rounded-lg shadow transition`}
            >
                {loading && (
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-opacity-50 border-solid"></span>
                )}
                {loading ? 'Syncing Documents...' : 'Sync Documents'}
            </button>
            )}
        </div>

      {/* Documents Section */}
      {documents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-800">📂 Your Documents</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-1 px-3 py-1.5 border rounded-md text-sm ${viewMode === 'card' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`}
              >
                <LayoutGrid size={16} /> Card
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-3 py-1.5 border rounded-md text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`}
              >
                <ListIcon size={16} /> List
              </button>
            </div>
          </div>

          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {documents.map((doc, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow border border-gray-200 hover:shadow-md transition">
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">📄 {doc.description}</h4>
                  <p className="text-sm text-gray-600 mb-1">🆔 <strong>{doc.docId}</strong></p>
                  <p className="text-sm text-gray-600 mb-2">📅 Issued: {new Date(Number(doc.issueDate)).toLocaleDateString()}</p>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${doc.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {doc.verified ? '✅ Verified' : '⏳ Pending Verification'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 bg-white rounded-lg shadow border border-gray-200">
              {documents.map((doc, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition">
                  <h4 className="font-semibold text-gray-800">📄 {doc.description}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>🆔 {doc.docId}</span>
                    <span>📅 {new Date(Number(doc.issueDate)).toLocaleDateString()}</span>
                    <span className={`font-semibold ${doc.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {doc.verified ? '✅ Verified' : '⏳ Pending Verification'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}