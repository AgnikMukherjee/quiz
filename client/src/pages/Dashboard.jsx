import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  

  return (
    <div>
      <Navbar/>

    <main>
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

        
      </div>
    </div>
    </main>

      <Footer/>
    </div>
  );
};

export default Dashboard;
