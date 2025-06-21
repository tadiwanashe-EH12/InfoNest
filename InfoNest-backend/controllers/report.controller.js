const Loan = require('../models/Loan');

exports.getActiveLoans = async (req, res) => {
  const today = new Date();
  const loans = await Loan.find({ returnDate: null })
    .populate('member bookCopy')
    .populate({ path: 'bookCopy', populate: { path: 'book' } });

  const formatted = loans.map(loan => ({
    memberName: loan.member.fullName,
    bookTitle: loan.bookCopy.book.title,
    dueDate: loan.dueDate,
    isOverdue: loan.dueDate < today
  }));

  res.json(formatted);
};
