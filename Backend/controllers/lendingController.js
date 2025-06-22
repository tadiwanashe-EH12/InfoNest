const Loan = require('../models/Loan');

exports.getLoans = async (req, res) => {
  try {
    const [rows] = await Loan.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch loans' });
  }
};

exports.lendBook = async (req, res) => {
  const { member_id, book_id, copy_number } = req.body;
  try {
    await Loan.create({ member_id, book_id, copy_number });
    res.status(201).json({ message: 'Book lent successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Lending failed', details: err.message });
  }
};

exports.returnBook = async (req, res) => {
  const loanId = req.params.id;
  try {
    await Loan.returnLoan(loanId);
    res.json({ message: 'Book returned' });
  } catch (err) {
    res.status(400).json({ error: 'Return failed', details: err.message });
  }
};
