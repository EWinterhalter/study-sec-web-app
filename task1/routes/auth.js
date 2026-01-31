const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');

const rateLimiter = require('../middleware/rateLimit');
const sessionControl = require('../middleware/session');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = User.create({
    id: Date.now(),
    username,
    passwordHash,
    role: 'user',
    lastLogin: null
  });

  res.json({ message: 'User created' });
});

router.post('/login', rateLimiter, async (req, res) => {
  const { username, password } = req.body;
  const user = User.findByUsername(username);

  const log = `${new Date().toISOString()} | ${username}\n`;
  fs.appendFileSync('logs/login.log', log);

  if (!user) return res.sendStatus(401);

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.sendStatus(401);

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  sessionControl(user.id, token);
  user.lastLogin = new Date();

  res.json({ token });
});

module.exports = router;
