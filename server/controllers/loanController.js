const BookCopy = require('../models/BookCopy');
const Loan = require('../models/Loan');
const Fine = require('../models/Fine');
const Member = require('../models/Member');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.checkoutBook = catchAsync(async (req, res, next) => {
  const { bookCopyId, memberId } = req.body;

  // 1) Check if book copy exists and is available
  const bookCopy = await BookCopy.findById(bookCopyId);
  if (!bookCopy || bookCopy.status !== 'Available') {
    return next(new AppError('Book copy is not available for checkout', 400));
  }

  // 2) Check if member exists and is active
  const member = await Member.findById(memberId);
  if (!member || member.status !== 'Active') {
    return next(new AppError('Member is not active or does not exist', 400));
  }

  // 3) Check if member has unpaid fines
  const unpaidFines = await Fine.countDocuments({ 
    member: memberId, 
    paymentStatus: 'Unpaid' 
  });
  
  if (unpaidFines > 0) {
    return next(new AppError('Member has unpaid fines and cannot checkout books', 400));
  }

  // 4) Create the loan
  const newLoan = await Loan.create({
    bookCopy: bookCopyId,
    book: bookCopy.book,
    member: memberId,
    checkoutDate: Date.now(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  });

  // 5) Update book copy status
  bookCopy.status = 'Borrowed';
  await bookCopy.save();

  // 6) Update member's total loans
  member.totalLoans += 1;
  await member.save();

  res.status(201).json({
    status: 'success',
    data: {
      loan: newLoan
    }
  });
});

exports.returnBook = catchAsync(async (req, res, next) => {
  const { loanId } = req.params;
  const { condition } = req.body;

  // 1) Find the loan
  const loan = await Loan.findById(loanId)
    .populate('bookCopy')
    .populate('member');
  
  if (!loan || loan.status === 'Returned') {
    return next(new AppError('Loan not found or already returned', 404));
  }

  // 2) Update loan details
  loan.returnDate = Date.now();
  loan.status = 'Returned';
  
  // 3) Update book copy status based on condition
  const bookCopy = loan.bookCopy;
  if (condition === 'Lost') {
    bookCopy.status = 'Lost';
  } else if (condition === 'Damaged') {
    bookCopy.status = 'Maintenance';
  } else {
    bookCopy.status = 'Available';
  }
  await bookCopy.save();

  // 4) Calculate fine if overdue
  let fine = null;
  if (loan.dueDate < loan.returnDate) {
    const daysOverdue = Math.ceil(
      (loan.returnDate - loan.dueDate) / (1000 * 60 * 60 * 24)
    );
    const fineAmount = daysOverdue * 1; // $1 per day

    fine = await Fine.create({
      loan: loanId,
      member: loan.member._id,
      amount: fineAmount,
      issueDate: Date.now(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days to pay
    });

    // Update member's unpaid fines
    const member = loan.member;
    member.unpaidFines += fineAmount;
    await member.save();
  }

  await loan.save();

  res.status(200).json({
    status: 'success',
    data: {
      loan,
      fine
    }
  });
});

exports.renewLoan = catchAsync(async (req, res, next) => {
  const { loanId } = req.params;

  // 1) Find the loan
  const loan = await Loan.findById(loanId);
  
  if (!loan || loan.status !== 'Active') {
    return next(new AppError('Loan not found or not active', 404));
  }

  // 2) Check if already renewed
  if (loan.renewed) {
    return next(new AppError('Loan has already been renewed once', 400));
  }

  // 3) Renew the loan (extend by 14 days)
  loan.dueDate = new Date(loan.dueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  loan.renewed = true;
  await loan.save();

  res.status(200).json({
    status: 'success',
    data: {
      loan
    }
  });
});

exports.getAllLoans = catchAsync(async (req, res, next) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const loans = await Loan.find(filter)
    .populate('book')
    .populate('bookCopy')
    .populate('member');

  res.status(200).json({
    status: 'success',
    results: loans.length,
    data: {
      loans
    }
  });
});

exports.getOverdueLoans = catchAsync(async (req, res, next) => {
  const overdueLoans = await Loan.find({
    status: 'Active',
    dueDate: { $lt: new Date() }
  })
  .populate('book')
  .populate('member');

  res.status(200).json({
    status: 'success',
    results: overdueLoans.length,
    data: {
      loans: overdueLoans
    }
  });
});