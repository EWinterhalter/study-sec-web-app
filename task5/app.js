const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

let users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('secret123', 10),
    email: 'admin@test.com',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user1',
    password: bcrypt.hashSync('qwerty', 10),
    email: 'user1@test.com',
    role: 'user'
  }
];

function checkAdmin(req, res, next) {
  if (req.query.token !== 'admin_token') {
    return res.status(403).send('Forbidden');
  }
  next();
}

app.get('/users', (req, res) => {
  const safeUsers = users.map(user => ({
    username: user.username,
    email: user.email,
    role: user.role
  }));
  res.json(safeUsers);
});

app.put('/users/:id', checkAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).send('User not found');

  const allowedUpdates = ['email', 'password'];
  const updates = Object.keys(req.body);

  const isValid = updates.every(field => allowedUpdates.includes(field));
  if (!isValid) return res.status(400).send('Invalid updates');

  for (const field of updates) {
    if (field === 'password') {
      user.password = await bcrypt.hash(req.body.password, 10);
    } else {
      user[field] = req.body[field];
    }
  }

  res.json({
    message: 'User updated successfully',
    user: {
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
