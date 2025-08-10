const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

require('dotenv').config(); // ✅ Load environment variables

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: 'User created successfully' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

res.status(200).json({ message: 'Login successful', userId: user._id });

});
router.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

module.exports = router;
