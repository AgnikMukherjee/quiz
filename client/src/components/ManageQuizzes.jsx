import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ManageQuizzes = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const { token } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        document.title = "Manage Quizzes | Admin";
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/api/quiz/my-quizzes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setQuizzes(data);
        } catch (err) {
            console.error('Error fetching quizzes', err);
        }
    };

    const handleViewAttempts = async (quizId) => {
        setSelectedQuizId(quizId);
        setMessage('Loading attempts...');
        try {
            const res = await fetch(`${SERVER_URL}/api/quiz/${quizId}/attempts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setAttempts(data.attempts)
            setMessage('');
        } catch (err) {
            setMessage('Failed to load attempts.');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Manage Quizzes</h2>
            {quizzes.map((quiz) => (
                <div key={quiz._id} className="border p-4 rounded mb-4">
                    <h3 className="text-xl font-semibold">{quiz.title}</h3>
                    <p className="text-gray-600 mb-2">Tags: {quiz.tags.join(', ')}</p>
                    <button
                        onClick={() => handleViewAttempts(quiz._id)}
                        className="text-sm text-blue-700 underline"
                    >
                        View Attempts
                    </button>

                    {selectedQuizId === quiz._id && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Attempts:</h4>
                            {message && <p>{message}</p>}
                            {attempts.length === 0 && !message && <p>No attempts yet.</p>}
                            <ul className="space-y-1">
                                {Array.isArray(attempts) && attempts.length === 0 && !message && (
                                    <p>No attempts yet.</p>
                                )}

                                {Array.isArray(attempts) &&
                                    attempts.map((attempt, index) => (
                                        <li key={index} className="text-gray-800">
                                            {attempt.username || 'Anonymous'} - Score: {attempt.score} / {attempt.total}
                                        </li>
                                    ))}

                                {!Array.isArray(attempts) && !message && (
                                    <p className="text-red-600">⚠️ Failed to load attempts.</p>
                                )}
                            </ul>

                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ManageQuizzes;