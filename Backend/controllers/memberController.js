const db = require('../models/db');
const Member = require('../models/Member');

exports.getMembers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM members');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch members' });
  }
};

exports.createMember = async (req, res) => {
  const { full_name, email, phone } = req.body;

  try {
    await db.query(
      'INSERT INTO members (full_name, email, phone, membership_date, status) VALUES (?, ?, ?, NOW(), "Active")',
      [full_name, email, phone]
    );
    res.status(201).json({ message: 'Member created' });
  } catch (err) {
    res.status(400).json({ error: 'Member creation failed', details: err.message });
  }
};

exports.updateMember = async (req, res) => {
  const id = req.params.id;
  const { full_name, email, phone } = req.body;

  try {
    await db.query(
      'UPDATE members SET full_name = ?, email = ?, phone = ? WHERE id = ?',
      [full_name, email, phone, id]
    );
    res.json({ message: 'Member updated' });
  } catch (err) {
    res.status(400).json({ error: 'Member update failed', details: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  const id = req.params.id;

  try {
    const [loans] = await db.query(
      'SELECT COUNT(*) AS total FROM loans WHERE member_id = ? AND returned_on IS NULL',
      [id]
    );

    const [fines] = await db.query(
      'SELECT COUNT(*) AS total FROM fines WHERE member_id = ? AND paid = FALSE',
      [id]
    );

    if (loans[0].total > 0 || fines[0].total > 0) {
      return res.status(400).json({
        message: 'Cannot inactivate: member has active loans or unpaid fines'
      });
    }

    await Member.softDelete(id);
    res.json({ message: 'Member successfully inactivated' });
  } catch (err) {
    res.status(500).json({ error: 'Inactivation failed', details: err.message });
  }
};
