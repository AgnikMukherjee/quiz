import { Link } from 'react-router-dom';

const AdminSidebar = () => (
  <div className="w-64 bg-white p-4 shadow-lg">
    <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
    <ul className="space-y-4">
      <li>
        <Link to="/admin/create-quiz" className="text-blue-600 hover:underline">Create Quiz</Link>
      </li>
    </ul>
  </div>
);

export default AdminSidebar;
