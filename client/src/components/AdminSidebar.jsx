import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:w-50 w-20 md:border-r border-b md:border-b-0 border-gray-300 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800 ">
        Admin Panel
      </h2>
      <ul className="space-y-4">
        <li>
          <Link
            to="/admin/create-quiz"
            className={`block px-4 py-2 rounded hover:bg-blue-100 ${isActive('/admin/create-quiz') ? 'bg-blue-200 text-blue-800 font-semibold' : 'text-blue-600'
              }`}
          >
            Create Quiz
          </Link>
        </li>

        <li>
          <Link
            to="/admin/quizzes"
            className={`block px-4 py-2 rounded hover:bg-blue-100 ${isActive('/admin/quizzes') ? 'bg-blue-200 text-blue-800 font-semibold' : 'text-blue-600'
              }`}
          >
            Manage Quizzes
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
