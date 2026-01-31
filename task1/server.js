require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(express.json());

app.use(authRoutes);
app.use(adminRoutes);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
