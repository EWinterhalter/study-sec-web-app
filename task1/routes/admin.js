const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.get('/admin', auth, role('admin'), (req, res) => {
  res.json({ message: 'Admin panel' });
});

module.exports = router;
