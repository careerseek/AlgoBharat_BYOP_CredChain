import { useEffect, useState } from "react";
import { UserDocument } from "../interfaces/UserDocument";
import { LayoutGrid, List as ListIcon } from "lucide-react";

export default function MyDocuments() {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
            query {
              getUserDocuments(userId: "${userId}") {
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
      const docs = data.data.getUserDocuments;
      setDocuments(docs);
      setFilteredDocs(docs);
      setLoading(false);
    };

    fetchDocs();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = documents.filter((doc) => {
      const matchesType = selectedType === "ALL" || doc.docType === selectedType;
      const matchesSearch =
        (doc.description?.toLowerCase() ?? "").includes(lower) ||
        (doc.docId?.toLowerCase() ?? "").includes(lower);
      return matchesType && matchesSearch;
    });
    setFilteredDocs(filtered);
  }, [searchTerm, selectedType, documents]);

  const uniqueDocTypes = ["ALL", ...Array.from(new Set(documents.map((doc) => doc.docType)))];
  const verifiedDocs = filteredDocs.filter(doc => doc.verified);
  const unverifiedDocs = filteredDocs.filter(doc => !doc.verified);

  const renderCard = (doc: UserDocument) => (
    <div
      key={doc.docId}
      className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
    >
      <h2 className="text-lg font-bold text-gray-800 mb-1">📄 {doc.description}</h2>
      <p className="text-sm text-gray-500">🆔 {doc.docId}</p>
      <p className="text-sm text-gray-500">📁 Type: {doc.docType}</p>
      <p className="text-sm text-gray-500">🏛️ Org: {doc.orgName}</p>
      <p className="text-sm text-gray-500">📅 Issued: {new Date(doc.issueDate).toLocaleDateString()}</p>
      <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold ${doc.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {doc.verified ? "✅ Verified" : "⚠️ Not Verified"}
      </span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Banner */}
      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">📁 My Documents on CredChain</h1>
          <p className="text-sm text-gray-600">Total Documents: {documents.length} | Verified: {verifiedDocs.length} | Unverified: {unverifiedDocs.length}</p>
        </div>
        <img src="/imgs/hero-docs.png" className="h-20 object-contain hidden sm:block" alt="Banner" />
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm shadow-sm"
        >
          {uniqueDocTypes.map(type => <option key={type}>{type}</option>)}
        </select>

        <input
          type="text"
          placeholder="🔍 Search by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm shadow-sm"
        />

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 border ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600'}`}
          >
            <LayoutGrid size={16} /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 border ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600'}`}
          >
            <ListIcon size={16} /> List
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading documents...</p>
      ) : (
        <>
          {verifiedDocs.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">✅ Verified Documents</h3>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-4'}>
                {verifiedDocs.map(renderCard)}
              </div>
            </div>
          )}
          {unverifiedDocs.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-yellow-700 mt-8 mb-2">⚠️ Not Verified Documents</h3>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-4'}>
                {unverifiedDocs.map(renderCard)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
