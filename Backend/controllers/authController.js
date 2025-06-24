const bcrypt = require('bcryptjs');
const db = require('../models/db');

exports.loginLibrarian = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM librarians WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Account not registered' });

    const librarian = rows[0];
    const match = await bcrypt.compare(password, librarian.password);

    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', user: { id: librarian.id, name: librarian.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
