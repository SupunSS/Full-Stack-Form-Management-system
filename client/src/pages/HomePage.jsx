import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4">Form Management</h1>
      <p className="text-slate-400 mb-8 text-center max-w-md">
        Submit your details securely, or sign in as an admin to manage submissions.
      </p>

      {!user && (
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium">
            Customer Login
          </Link>
          <Link to="/register" className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium">
            Register
          </Link>
          <Link to="/admin/login" className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium border border-slate-600">
            Admin Login
          </Link>
        </div>
      )}

      {user && user.role === 'CUSTOMER' && (
        <div className="flex gap-4">
          <Link to="/application" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium">
            Go to Application Form
          </Link>
          <button onClick={logout} className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium">
            Logout
          </button>
        </div>
      )}

      {user && user.role === 'ADMIN' && (
        <div className="flex gap-4">
          <Link to="/admin/dashboard" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium">
            Go to Dashboard
          </Link>
          <button onClick={logout} className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;