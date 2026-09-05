import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 border-b border-slate-700 bg-slate-900">
      <span className="font-semibold">
        {user.role === 'ADMIN' ? 'Admin Panel' : 'Customer Portal'}
      </span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400">{user.email}</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;