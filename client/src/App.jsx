import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './components/CreateQuiz';
import ManageQuizzes from './components/ManageQuizzes';
import AvailableQuizzes from './pages/AvailableQuizzes';
import QuizAttemptPage from './pages/QuizAttemptPage';


const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />

      <Route
        path="/admin/create-quiz"
        element={
          user && user.role === 'Admin' ? (
            <CreateQuiz />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/quizzes"
        element={user?.role === 'Admin' ? <ManageQuizzes /> : <Navigate to="/login" />}
      />

      <Route path="/quizzes" element={<AvailableQuizzes />} />
      <Route path="/quizzes/:quizId" element={<QuizAttemptPage />} />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default App;
