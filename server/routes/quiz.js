import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import Quiz from '../models/Quiz.js';
import openai from '../configs/deepseek.js';
// import openai from '../configs/openai.js'; 

import Attempt from '../models/Attempt.js';




const quizRouter = express.Router();


// AI Explanation Route
quizRouter.post('/ai/explanation', authenticate, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const aiPrompt = `Explain why the answer is wrong: ${prompt}`;

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528:free',
      messages: [{ role: 'user', content: aiPrompt }],
    });

    const explanation = completion.choices[0].message.content;
    res.json({ explanation });
  } catch (err) {
    console.error('AI Explanation Error:', err);
    res.status(500).json({ error: 'Failed to get AI explanation' });
  }
});

// quiz (Admin only)
quizRouter.post('/create', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const { title, tags, questions } = req.body;

    const newQuiz = new Quiz({
      title,
      tags,
      questions,
      createdBy: req.user.id
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

quizRouter.get('/my-quizzes', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your quizzes' });
  }
});

quizRouter.get('/:quizId/attempts', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const attempts = await Attempt.find({ quiz: req.params.quizId }).populate('user', 'username').lean();;
    const formatted = attempts.map(a => ({
      username: a.user?.username || 'N/A',
      score: a.score,
      total: a.total,
      responses: a.responses,
      attemptedAt: a.createdAt,
    }));

    res.json({ attempts: formatted });
  } catch (err) {
    console.error('Error fetching attempts:', err); //testing
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

//(for users)
quizRouter.get('/all', authenticate, async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-questions.options.isCorrect');

    const attempts = await Attempt.find({ user: req.user.id }).select('quiz');
    const attemptedIds = attempts.map((a) => a.quiz.toString());

    res.json({ quizzes, attemptedIds }); // ✅ returns both
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

quizRouter.get('/:quizId', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).lean();

    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Remove correct answers before sending to user
    quiz.questions = quiz.questions.map(q => ({
      ...q,
      options: q.options.map(({ text }) => ({ text }))
    }));

    res.json(quiz);
  } catch (err) {
    console.error('Quiz fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});


quizRouter.post('/:quizId/attempt', authenticate, async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;
    const quizId = req.params.quizId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Check if user already attempted
    const already = await Attempt.findOne({ quiz: quizId, user: userId });
    if (already) {
      return res.status(400).json({ error: 'You already attempted this quiz.' });
    }

    let score = 0;
    const responses = quiz.questions.map((q) => {
      const userAnswer = answers.find((a) => a.questionId === q._id.toString());
      const selected = userAnswer?.selectedOption;
      const correctOption = q.options.find((opt) => opt.isCorrect);
      const isCorrect = selected === correctOption.text;

      if (isCorrect) score++;

      return {
        questionId: q._id,
        selectedOption: selected || '',
        isCorrect,
      };
    });

    const attempt = new Attempt({
      user: userId,
      quiz: quizId,
      answers,
      score,
      total: quiz.questions.length,
      responses,
    });

    await attempt.save();

    res.status(200).json({
      message: 'Attempt submitted',
      score,
      total: quiz.questions.length,
      responses,
    });
  } catch (err) {
    console.error('Attempt error:', err);
    res.status(500).json({ error: 'Failed to submit attempt' });
  }
});


//  open ai assist for admins with OpenAI credits
// quizRouter.post('/ai-assist', authenticate, authorize(['Admin']), async (req, res) => {
//     try {
//         const { topic, numQuestions } = req.body;

//         console.log('🧪 AI Assist Request:', topic, numQuestions); //testing

//         if (!topic || !numQuestions) {
//             return res.status(400).json({ error: 'Topic and number of questions are required' });
//         }

//         const prompt = `Generate ${numQuestions} multiple-choice questions on the topic "${topic}". Each question should have 1 correct answer and 3 incorrect options. Format as JSON:
//             [
//                 {
//                     "questionText": "...",
//                     "options": [
//                                 { "text": "...", "isCorrect": true },
//                                 { "text": "...", "isCorrect": false },
//                                 { "text": "...", "isCorrect": false },
//                                 { "text": "...", "isCorrect": false }
//                                ]
//                 },
//                 ...
//             ]`;

//         const completion = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo',
//             messages: [{ role: 'user', content: prompt }],
//         });

//         const aiContent = completion.choices[0].message.content;
//         console.log('✅ OpenAI Raw Response:', aiContent);//testing

//         let questions;

//         try {
//             questions = JSON.parse(aiContent);
//         } catch (err) {
//             return res.status(500).json({ error: 'Failed to parse AI response' });
//         }

//         res.status(200).json({ questions });
//     } catch (err) {
//         console.error('AI Assist error:', err);
//         res.status(500).json({ error: 'AI Assist failed' });
//     }
// });




// Fallback AI Assist for development without OpenAI credits
// quizRouter.post('/ai-assist', authenticate, authorize(['Admin']), async (req, res) => {
//     try {
//         const { topic, numQuestions } = req.body;

//         if (!topic || !numQuestions) {
//             return res.status(400).json({ error: 'Topic and number of questions are required' });
//         }

//         //Generate dummy questions as i have no OpenAI credits
//         const questions = Array.from({ length: numQuestions }, (_, i) => ({
//             questionText: `What is question ${i + 1} about ${topic}?`,
//             options: [
//                 { text: 'Option A', isCorrect: i % 4 === 0 },
//                 { text: 'Option B', isCorrect: i % 4 === 1 },
//                 { text: 'Option C', isCorrect: i % 4 === 2 },
//                 { text: 'Option D', isCorrect: i % 4 === 3 },
//             ]
//         }));

//         res.status(200).json({ questions });
//     } catch (err) {
//         console.error('Mock AI Assist error:', err.message);
//         res.status(500).json({ error: 'AI Assist mock failed' });
//     }
// });




quizRouter.post('/generate', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const { topic, numQuestions = 5, difficulty = 'medium' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // AI Prompt
    const prompt = `
    Generate exactly ${numQuestions} multiple-choice questions about "${topic}" with difficulty: ${difficulty}.

    Follow these rules:
    1. Each question must have 4 options
    2. Only one correct answer per question
    3. Return as valid JSON array

    Strictly return only a JSON array like:
    [
        {
            "questionText": "...",
            "options": [
                        { "text": "...", "isCorrect": true },
                        { "text": "...", "isCorrect": false },
                        { "text": "...", "isCorrect": false },
                        { "text": "...", "isCorrect": false }
                    ]
        },
        ...
    ]
    
    Do not return any Markdown or prose. Only return valid JSON.`;


    const response = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528:free',
      messages: [{ role: 'user', content: prompt }],
      //   response_format:'json' ,
    });
    console.log("AI Test:", response.choices[0].message.content); //testing


    const content = response.choices[0].message.content;
    let questions;

    try {
      questions = JSON.parse(content);
      if (!Array.isArray(questions)) {
        throw new Error('AI returned invalid format');
      }
    } catch (err) {
      console.error('Failed to parse AI response:', content);
      console.log(' Raw content from AI:', content); //testing
      throw new Error('AI returned invalid JSON');
    }

    return res.json({
      success: true,
      questions,
      source: "DeepSeek R1 AI"
    });

  } catch (error) {
    console.error('AI Generation Failed:', error.message);
    console.error(error);

    // Fallback: Mock Data
    const { topic, numQuestions = 5 } = req.body;

    const mockQuestions = Array.from({ length: numQuestions || 5 }, (_, i) => ({
      questionText: `${topic} question ${i + 1}`,
      options: [
        { text: 'Option A', isCorrect: i % 4 === 0 },
        { text: 'Option B', isCorrect: i % 4 === 1 },
        { text: 'Option C', isCorrect: i % 4 === 2 },
        { text: 'Option D', isCorrect: i % 4 === 3 },
      ],
    }));

    res.status(200).json({
      success: false,
      questions: mockQuestions,
      warning: "AI Server is busy right now. Used mocked data instead."
    });
  }
});









export default quizRouter;