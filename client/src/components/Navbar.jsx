import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 min-h-[3vw] text-white px-6 py-4  flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Quiz</h1>
      
      <div className="flex items-center gap-4 ">
        <span>{user?.role} | {user?.username}</span>
        
        <button
          className="mt-4 text-sm border border-red-500 rounded px-4 py-2 text-red-500 bg-white hover:bg-red-500 hover:text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
