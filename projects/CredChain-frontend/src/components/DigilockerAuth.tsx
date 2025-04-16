import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function DigilockerAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('cred_user') || '{}');
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const simulateOAuth = async () => {
      // Simulate OAuth delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Actually call backend to link
      await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation {
              linkDigilocker(userId: "${user.id}") {
                id
                digilockerLinked
              }
            }
          `,
        }),
      });

      navigate('/dashboard');
    };

    simulateOAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-semibold text-indigo-700 mb-4">
          Connecting to DigiLocker...
        </h1>
        <p className="text-gray-500">Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
}