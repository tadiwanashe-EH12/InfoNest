const Librarian = require('../models/Librarian');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const librarian = await Librarian.findOne({ email });
  if (!librarian) return res.status(404).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, librarian.passwordHash);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: librarian._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({ token });
};
