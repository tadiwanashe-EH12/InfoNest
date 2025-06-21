const Loan = require('../models/Loan');
const Member = require('../models/Member');
const BookCopy = require('../models/BookCopy');
const Fine = require('../models/Fine');
const mongoose = require('mongoose');

const getDueDate = () => {
  const due = new Date();
  due.setDate(due.getDate() + 14);
  return due;
};

exports.checkoutBook = async (req, res) => {
  const { memberId, copyId } = req.body;

  try {
    const member = await Member.findById(memberId);
    const copy = await BookCopy.findOne({ copyId });

    if (!member || !copy) return res.status(404).json({ error: 'Member or Book Copy not found' });
    if (member.status !== 'Active') return res.status(400).json({ error: 'Member is not active' });
    if (copy.status !== 'Available') return res.status(400).json({ error: 'Book copy is not available' });

    const loan = new Loan({
      member: member._id,
      bookCopy: copy._id,
      dueDate: getDueDate(),
    });

    await loan.save();
    copy.status = 'Borrowed';
    await copy.save();

    res.status(201).json({ message: 'Book checked out', loan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findById(loanId).populate('bookCopy').populate('member');
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    if (loan.returnDate) return res.status(400).json({ error: 'Book already returned' });

    const now = new Date();
    loan.returnDate = now;

    let fineAmount = 0;
    if (now > loan.dueDate) {
      const daysLate = Math.floor((now - loan.dueDate) / (1000 * 60 * 60 * 24));
      fineAmount = daysLate;

      const fine = new Fine({
        member: loan.member._id,
        loan: loan._id,
        amount: fineAmount,
      });

      await fine.save();
      loan.fine = fine._id;

      loan.member.status = 'Inactive';
      await loan.member.save();
    }

    loan.bookCopy.status = 'Available';
    await loan.bookCopy.save();
    await loan.save();

    res.json({ message: 'Book returned', fine: fineAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
