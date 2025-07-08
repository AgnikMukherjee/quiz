import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CommonSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null; // Sidebar only shows for logged-in users

  const links = user.role === 'Admin'
    ? [
        { path: '/admin/create-quiz', label: 'Create Quiz' },
        { path: '/admin/quizzes', label: 'Manage Quizzes' },
      ]
    : [
        { path: '/quizzes', label: 'View Quizzes' },
      ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="md:w-50 w-20 md:border-r border-b md:border-b-0 border-gray-300 bg-gray-50 min-h-screen">
      <ul>
        {links.map(({ path, label }) => (
          <li key={path}>
            <Link
              to={path}
              className={`block px-4 py-2 rounded hover:bg-blue-100 ${
                isActive(path)
                  ? 'bg-blue-200 text-blue-800 font-semibold'
                  : 'text-blue-600'
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommonSidebar;
