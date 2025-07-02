import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AvailableQuizzes = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [attemptedIds, setAttemptedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Available Quizzes';
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/quiz/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setQuizzes(data.quizzes);
      setAttemptedIds(data.attemptedIds || []);
    } catch (err) {
      console.error('Error fetching quizzes', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
      <ul className="space-y-4">
        {quizzes.map((quiz) => {
          const attempted = attemptedIds.includes(quiz._id);
          return (
            <li key={quiz._id} className="border rounded p-4 shadow">
              <h3 className="text-xl font-semibold">{quiz.title}</h3>
              <p className="text-gray-600 mb-2">Tags: {quiz.tags.join(', ')}</p>

              {attempted ? (
                <p className="text-green-600 font-semibold">✅ Already Attempted</p>
              ) : (
                <button
                  className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => navigate(`/quizzes/${quiz._id}`)}
                >
                  Attempt Quiz
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AvailableQuizzes;
