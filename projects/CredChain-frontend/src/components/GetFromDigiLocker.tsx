import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../interfaces/User';
import { UserDocument } from '../interfaces/UserDocument';

export default function GetFromDigilocker() {
    const [user, setUser] = useState<User | null>(null);
    const [isLinked, setIsLinked] = useState(false);
    const [linkedAt, setLinkedAt] = useState<string | null>(null);
    const [documents, setDocuments] = useState<UserDocument[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('cred_user');
        if (storedUser) {
            const parsed: User = JSON.parse(storedUser);
            setUser(parsed);
            fetchLinkedStatus(parsed.id);
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
                        }
                    }
                `
            })
        });
        const data = await res.json();
        setIsLinked(data.data.getUser.digilockerLinked);
        setLinkedAt(data.data.getUser.digilockerLinkedAt);
    };

    const handleConnect = async () => {
        navigate('/digilocker/auth');
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
        setIsLinked(false);
        setLinkedAt(null);
    };

    const handleImportDocs = async () => {
        if (!user) return;
        const res = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    mutation {
                        syncMockDocuments(userId: "${user.id}") {
                            docId
                            description
                            issueDate
                            verified
                        }
                    }
                `,
            })
        });
        const data = await res.json();
        setDocuments(data.data.syncMockDocuments || []);
    };

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🔗 Get Your Documents from DigiLocker</h1>
            <p className="text-gray-600 mb-6">
                Connect to DigiLocker to fetch and manage your verified government-issued documents securely.
            </p>

            {!isLinked ? (
                <button
                    onClick={handleConnect}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow"
                >
                    Connect to DigiLocker
                </button>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">📁 DigiLocker Connected</h2>
                            {linkedAt && (
                                <p className="text-sm text-gray-500">Linked on: {new Date(linkedAt).toLocaleString()}</p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleImportDocs}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Import Documents
                            </button>
                            <button
                                onClick={handleDisconnect}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {documents.map((doc, index) => (
                            <div key={index} className="bg-white p-4 rounded shadow border border-gray-200">
                                <h3 className="text-lg font-semibold">📄 {doc.description}</h3>
                                <p className="text-sm text-gray-600">🆔 ID: {doc.docId}</p>
                                <p className="text-sm text-gray-600">📅 Issued: {new Date(Number(doc.issueDate)).toLocaleDateString()}</p>
                                <p className={`text-sm font-semibold ${doc.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {doc.verified ? '✅ Verified' : '⏳ Pending Verification'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
