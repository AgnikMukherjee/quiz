import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./configs/mongodb.js";

dotenv.config();
const app = express();
await connectDB()


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Eubrics!');
})


// app.use('/api/auth', authRoutes);
// app.use('/api/quiz', quizRoutes);
// app.use('/api/chat', chatbotRoutes);


const PORT = process.env.PORT || 5000

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${PORT} `);
});