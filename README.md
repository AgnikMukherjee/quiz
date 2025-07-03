# 🧠 AI-Powered Quiz App (MERN Stack)

This is a full-stack **quiz application** built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It supports **AI-assisted quiz generation**, **role-based access** (Admin & User), and **quiz attempt tracking** with explanations.

## 🚀 Features

### 👤 User (Role: `User`)
- View all available quizzes
- Attempt each quiz only once
- Get instant scores after submission
- Ask AI to explain wrong answers

### 🛠️ Admin (Role: `Admin`)
- Create quizzes manually or using AI (DeepSeek model)
- View all created quizzes
- View user attempts with usernames and scores

### 🤖 AI Integration
- Generate quiz questions based on topic + difficulty
- Explain incorrect answers using AI prompts
- Fallback to mock data if AI service is unavailable

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT
- **AI Integration**: OpenRouter + DeepSeek Model
- **Hosting** (Bonus): Vercel (Frontend) + Render (Backend)

## 🚀 Live Demo

🔗 [https://quiz-delta-navy.vercel.app]

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AgnikMukherjee/quiz.git
cd quiz

⚙️ .env Setup Guide
Each folder (client and backend) has its own .env.example. Follow them carefully.

✅ Don't rename any keys — just provide your own values.



🧠 AI Integration Note
We use the DeepSeek R1 model via OpenRouter. You need to generate an API key and configure the .env file to use AI quiz generation and answer explanations.

Free to use , unlimited requests !
