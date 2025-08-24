import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateQuiz = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const { token } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('manual'); // 'manual' or 'ai'
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(0); //

  const handleGenerate = async () => {
    setMessage('Generating questions...');
    try {
      const res = await fetch(`${SERVER_URL}/api/quiz/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic, numQuestions }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setMessage('✅ Questions generated. You can now edit them.');
      } else {
        setMessage('⚠️ Failed to generate questions.');
      }
    } catch (err) {
      setMessage('❌ Error generating questions');
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const handleQuestionChange = (qIdx, field, value) => {
    const updated = [...questions];
    updated[qIdx][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, oIdx, field, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx][field] = field === 'isCorrect' ? value : value;
    setQuestions(updated);
  };

  const handleSave = async () => {
    if (!title || questions.length === 0) {
      setMessage('⚠️ Title and questions are required.');
      return;
    }
    try {
      const res = await fetch(`${SERVER_URL}/api/quiz/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          tags: tags.split(',').map((t) => t.trim()),
          questions,
          duration,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Quiz created successfully');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setMessage(data.error || '❌ Failed to create quiz');
      }
    } catch (err) {
      setMessage('❌ Error saving quiz');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('manual')}
          className={`px-4 py-2 rounded ${mode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Manual
        </button>
        <button
          onClick={() => setMode('ai')}
          className={`px-4 py-2 rounded ${mode === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          AI Generate
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Title</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Quiz Duration (minutes)</label>
        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="e.g. 10"
        />
      </div>


      <div className="mb-4">
        <label className="block font-medium mb-1">Tags</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. tag-1, tag-2 ..."
        />
      </div>

      {mode === 'ai' && (
        <div className="mb-4 border rounded p-4 bg-gray-50">
          <label className="block font-medium mb-1">Topic</label>
          <input
            className="w-full border px-3 py-2 rounded mb-2"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. JavaScript"
          />

          <label className="block font-medium mb-1">Number of Questions</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded mb-2"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          />
          {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}

          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generate Questions
          </button>
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={handleAddQuestion}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Question
        </button>
      </div>

      {questions.map((q, qIdx) => (
        <div key={qIdx} className="mb-6 p-4 border rounded">
          <label className="block font-semibold mb-1">Question {qIdx + 1}</label>
          <input
            className="w-full border px-3 py-2 rounded mb-2"
            value={q.questionText}
            onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
            placeholder="Enter question text"
          />
          {q.options.map((opt, oIdx) => (
            <div key={oIdx} className="flex items-center gap-2 mb-1">
              <input
                className="flex-1 border px-3 py-1 rounded"
                value={opt.text}
                onChange={(e) => handleOptionChange(qIdx, oIdx, 'text', e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
              />
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`correct-${qIdx}`}
                  checked={opt.isCorrect}
                  onChange={() => {
                    const updated = [...questions];
                    updated[qIdx].options = updated[qIdx].options.map((o, i) => ({
                      ...o,
                      isCorrect: i === oIdx,
                    }));
                    setQuestions(updated);
                  }}
                /> Correct
              </label>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSave}
        className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
      >
        Save Quiz
      </button>

    </div>
  );
};

export default CreateQuiz;
