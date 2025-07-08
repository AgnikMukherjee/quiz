
import Footer from '../components/Footer';
import CommonSidebar from '../components/CommonSidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {


const { user, logout } = useAuth();

  return (
    <div>
      <main className="text-default min-h-screen bg-white flex">
        <CommonSidebar />

        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
          <div className="bg-white shadow-md rounded p-8 w-full max-w-md text-center">
            <h1 className="text-2xl font-semibold mb-4">
              Welcome, {user?.role} <span className="text-blue-600">{user?.username}</span>
            </h1>

            {user?.role === 'Admin' ? (
              <div>
                <p className="mb-4 text-gray-700">You have admin access.</p>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-gray-700">Start taking quizzes to improve your knowledge ! </p>
              </div>
            )}


          </div>
        </div>
        
        {/* <div className="flex-1 p-6">
          <Outlet /> 
        </div> */}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
