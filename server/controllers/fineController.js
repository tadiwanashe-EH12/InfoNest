const Fine = require('../models/Fine');
const Member = require('../models/Member');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllFines = catchAsync(async (req, res, next) => {
  const { paymentStatus } = req.query;
  const filter = paymentStatus ? { paymentStatus } : {};

  const fines = await Fine.find(filter)
    .populate('member')
    .populate('loan');

  res.status(200).json({
    status: 'success',
    results: fines.length,
    data: {
      fines
    }
  });
});

exports.getFine = catchAsync(async (req, res, next) => {
  const fine = await Fine.findById(req.params.id)
    .populate('member')
    .populate('loan');

  if (!fine) {
    return next(new AppError('No fine found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      fine
    }
  });
});

exports.payFine = catchAsync(async (req, res, next) => {
  const { amountPaid, paymentMethod } = req.body;

  const fine = await Fine.findById(req.params.id);
  if (!fine) {
    return next(new AppError('No fine found with that ID', 404));
  }

  if (fine.paymentStatus === 'Paid') {
    return next(new AppError('Fine has already been paid', 400));
  }

  if (amountPaid < fine.amount) {
    fine.paymentStatus = 'Partially Paid';
  } else {
    fine.paymentStatus = 'Paid';
  }

  fine.paymentDate = Date.now();
  fine.paymentMethod = paymentMethod;
  await fine.save();

  // Update member's unpaid fines
  const member = await Member.findById(fine.member);
  if (member) {
    member.unpaidFines = Math.max(0, member.unpaidFines - amountPaid);
    await member.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      fine
    }
  });
});

exports.waiveFine = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const fine = await Fine.findByIdAndUpdate(
    req.params.id,
    {
      paymentStatus: 'Waived',
      paymentDate: Date.now(),
      notes: reason
    },
    { new: true }
  );

  if (!fine) {
    return next(new AppError('No fine found with that ID', 404));
  }

  // Update member's unpaid fines
  const member = await Member.findById(fine.member);
  if (member) {
    member.unpaidFines = Math.max(0, member.unpaidFines - fine.amount);
    await member.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      fine
    }
  });
});

exports.getMemberFines = catchAsync(async (req, res, next) => {
  const fines = await Fine.find({ member: req.params.memberId })
    .populate('loan');

  res.status(200).json({
    status: 'success',
    results: fines.length,
    data: {
      fines
    }
  });
});