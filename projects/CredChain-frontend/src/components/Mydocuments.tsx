// src/components/MyDocuments.tsx

import { useEffect, useState } from "react";

interface Document {
  docId: string;
  description: string;
  docType: string;
  issueDate: string;
  orgName: string;
  verified: boolean;
}

export default function MyDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      const userData = localStorage.getItem("cred_user");
      if (!userData) return;

      const { id: userId } = JSON.parse(userData);
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              syncMockDocuments(userId: "${userId}") {
                docId
                description
                docType
                issueDate
                orgName
                verified
              }
            }
          `,
        }),
      });

      const data = await response.json();
      setDocuments(data.data.syncMockDocuments);
      setLoading(false);
    };

    fetchDocs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📄 My Documents</h1>

      {loading ? (
        <p className="text-gray-500">Loading documents...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.docId}
              className="bg-white p-4 shadow rounded-lg border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-700">{doc.description}</h2>
              <p className="text-sm text-gray-500">Type: {doc.docType}</p>
              <p className="text-sm text-gray-500">Issued on: {new Date(doc.issueDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Organization: {doc.orgName}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${
                  doc.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {doc.verified ? "✅ Verified" : "⚠️ Not Verified"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}