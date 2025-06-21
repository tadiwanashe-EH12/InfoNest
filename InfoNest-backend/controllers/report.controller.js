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

exports.getMemberHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const loans = await Loan.find({ member: id })
      .populate('bookCopy')
      .populate('fine')
      .sort({ checkoutDate: -1 });

    const history = loans.map((loan) => ({
      bookCopyId: loan.bookCopy.copyId,
      checkoutDate: loan.checkoutDate,
      returnDate: loan.returnDate,
      fine: loan.fine ? loan.fine.amount : 0,
      paid: loan.fine ? loan.fine.status === 'Paid' : true,
    }));

    res.json({ memberId: id, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

