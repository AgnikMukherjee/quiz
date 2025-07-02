import { useEffect, useState } from 'react';

export default function AdminQuizList() {

    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/quiz/my-quizzes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setQuizzes(data);
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Created Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes created yet.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="p-4 bg-white rounded shadow">
              <h3 className="text-lg font-bold">{quiz.title}</h3>
              <p className="text-sm text-gray-500">Tags: {quiz.tags.join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
