const Report = require('../models/Report');

exports.getOverdueLoans = async (req, res) => {
  try {
    const [rows] = await Report.getOverdueLoans();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch overdue loans' });
  }
};

exports.getUnpaidFines = async (req, res) => {
  try {
    const [rows] = await Report.getUnpaidFines();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch fines' });
  }
};

exports.getMemberHistory = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await Report.getMemberHistory(id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get member history' });
  }
};
