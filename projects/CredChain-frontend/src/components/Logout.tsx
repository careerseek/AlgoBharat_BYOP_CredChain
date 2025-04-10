import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('cred_user'); // Remove token/user
    navigate('/login'); // Redirect to login
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}