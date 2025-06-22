const Member = require('../models/Member');

exports.getMembers = async (req, res) => {
  try {
    const [rows] = await Member.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve members' });
  }
};

exports.createMember = async (req, res) => {
  const { full_name, email, phone } = req.body;
  try {
    await Member.create({ full_name, email, phone });
    res.status(201).json({ message: 'Member added' });
  } catch (err) {
    res.status(400).json({ error: 'Member creation failed', details: err.message });
  }
};

exports.updateMember = async (req, res) => {
  const id = req.params.id;
  const { full_name, email, phone } = req.body;
  try {
    await Member.update(id, { full_name, email, phone });
    res.json({ message: 'Member updated' });
  } catch (err) {
    res.status(400).json({ error: 'Update failed', details: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  const id = req.params.id;
  try {
    await Member.softDelete(id);
    res.json({ message: 'Member inactivated' });
  } catch (err) {
    res.status(400).json({ error: 'Deletion failed', details: err.message });
  }
};
