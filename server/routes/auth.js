import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authRouter = express.Router();

// Register
authRouter.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
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
      console.log('❌ User not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log('✅ User found:', user.username, user.role);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Password matched');

    // Show JWT_SECRET status
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1d' }
    );

    console.log('✅ Token generated');

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('🔥 Login Error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});



export default authRouter;
