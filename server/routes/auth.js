import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authRouter = express.Router();

// Register
// authRouter.post('/register', async (req, res) => {
//   const { username, password, role } = req.body;
//   try {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) return res.status(400).json({ error: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPassword, role });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// Register
authRouter.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, username: newUser.username },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Login
authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('Incoming login:', username, password);

    const user = await User.findOne({ username });
    if (!user) {
      console.log( 'User not found'); //testing
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log(' User found:', user.username, user.role); //testing

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(' Password does not match');//testing
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log(' Password matched'); //testing

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1d' }
    );

    console.log(' Token generated'); //testing

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error(' Login Error:', err.message); //testing
    return res.status(500).json({ error: 'Server error' });
  }
});



export default authRouter;
