const Fine = require('../models/Fine');

exports.getFines = async (req, res) => {
  try {
    const [rows] = await Fine.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch fines' });
  }
};

exports.createFine = async (req, res) => {
  const { member_id, amount, reason } = req.body;
  try {
    await Fine.create({ member_id, amount, reason });
    res.status(201).json({ message: 'Fine recorded' });
  } catch (err) {
    res.status(400).json({ error: 'Fine creation failed', details: err.message });
  }
};

exports.markFinePaid = async (req, res) => {
  const id = req.params.id;
  try {
    await Fine.markPaid(id);
    res.json({ message: 'Fine marked as paid' });
  } catch (err) {
    res.status(400).json({ error: 'Update failed', details: err.message });
  }
};
