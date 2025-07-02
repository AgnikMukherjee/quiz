import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const QuizAttemptPage = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const { token } = useAuth();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [explanations, setExplanations] = useState({});
  const [loadingExplanations, setLoadingExplanations] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setQuiz(data);
    } catch (err) {
      console.error('Failed to fetch quiz', err);
    }
  };

  const handleSelect = (questionId, optionText) => {
    setAnswers({ ...answers, [questionId]: optionText });
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    try {
      const res = await fetch(`${SERVER_URL}/api/quiz/${quizId}/attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: formattedAnswers }),
      });
      const data = await res.json();
      setResult(data);
      setSubmitted(true);
    } catch (err) {
      console.error('Submit failed', err);
      setMessage('Failed to submit attempt.');
    }
  };

  const handleAskAI = async (questionText, selectedOption) => {
    const prompt = `Explain why the answer "${selectedOption}" is wrong for the question: "${questionText}".`;

    setLoadingExplanations(prev => ({ ...prev, [questionText]: true }));

    try {
      const res = await fetch(`${SERVER_URL}/api/quiz/ai/explanation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setExplanations(prev => ({ ...prev, [questionText]: data.explanation }));
    } catch (err) {
      console.error('AI error', err);
      setExplanations(prev => ({ ...prev, [questionText]: 'Failed to fetch explanation.' }));
    } finally {
      setLoadingExplanations(prev => ({ ...prev, [questionText]: false }));
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>

      {quiz.questions.map((q, idx) => (
        <div key={q._id} className="mb-6 border p-4 rounded">
          <p className="font-semibold mb-2">
            {idx + 1}. {q.questionText}
          </p>
          {q.options.map((opt, oIdx) => (
            <label key={oIdx} className="block mb-1">
              <input
                type="radio"
                name={`q-${q._id}`}
                value={opt.text}
                checked={answers[q._id] === opt.text}
                onChange={() => handleSelect(q._id, opt.text)}
              />{' '}
              {opt.text}
            </label>
          ))}

          {submitted && result && result.responses.find(r => r.questionId === q._id)?.isCorrect === false && (
            <div className="mt-2">
              {loadingExplanations[q.questionText] ? (
                <p className="text-sm text-blue-500">🔄 Generating explanation...</p>
              ) : (
                <>
                  <button
                    className="text-sm text-blue-600 underline"
                    onClick={() => handleAskAI(q.questionText, answers[q._id])}
                  >
                    Why was my answer wrong?
                  </button>
                  {explanations[q.questionText] && (
                    <p className="mt-2 text-sm text-gray-700">
                      AI: {explanations[q.questionText]}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Your Score: {result.score} / {result.total}</h3>
        </div>
      )}

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default QuizAttemptPage;
