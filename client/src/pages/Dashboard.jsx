import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Welcome, {user?.role} <span className="text-blue-600">{user?.username}</span>
        </h1>

        {user?.role === 'Admin' ? ( 
          <>
            <p className="mb-4 text-gray-700">You have admin access.</p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-2"
              onClick={() => navigate('/admin/quizzes')}
            >
              Manage Quizzes
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-gray-700">Explore and take quizzes below!</p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-2"
              onClick={() => navigate('/quizzes')}
            >
              View Quizzes
            </button>
          </>
        )}

        <button
          className="mt-4 text-sm border border-red-500 rounded px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
