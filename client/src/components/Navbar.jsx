import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import bulb from '../assets/bulb.png'
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-b from-blue-500 to-blue-300 min-h-12 text-white px-4 flex justify-between items-center shadow-md">
      <div className='flex items-center gap-2'>
      <img src={bulb} alt="" className='w-6'/>
      <h1 className="text-xl font-bold">Quiz</h1>
      </div>
      
      <div className="flex items-center gap-4 ">
        <span>{user?.role} | {user?.username}</span>
        
        <button
          className="text-sm border border-red-500 rounded px-2 py-1 text-red-500 bg-white hover:bg-red-500 hover:text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
