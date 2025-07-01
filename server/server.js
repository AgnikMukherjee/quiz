import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./configs/mongodb.js";
import authRouter from './routes/auth.js';
import quizRouter from './routes/quiz.js';


dotenv.config();
const app = express();
await connectDB()


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Eubrics!');
})

app.use('/api/auth', authRouter);
app.use('/api/quiz', quizRouter);



const PORT = process.env.PORT || 5000

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${PORT} `);
});