const Member = require('../models/Member');
const Loan = require('../models/Loan');
const Fine = require('../models/Fine');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllMembers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Member.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const members = await features.query;

  res.status(200).json({
    status: 'success',
    results: members.length,
    data: {
      members
    }
  });
});

exports.getMember = catchAsync(async (req, res, next) => {
  const member = await Member.findById(req.params.id)
    .populate({
      path: 'loans',
      match: { status: 'Active' }
    })
    .populate({
      path: 'fines',
      match: { paymentStatus: 'Unpaid' }
    });

  if (!member) {
    return next(new AppError('No member found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      member
    }
  });
});

exports.createMember = catchAsync(async (req, res, next) => {
  const newMember = await Member.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      member: newMember
    }
  });
});

exports.updateMember = catchAsync(async (req, res, next) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!member) {
    return next(new AppError('No member found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      member
    }
  });
});

exports.deleteMember = catchAsync(async (req, res, next) => {
  const member = await Member.findByIdAndUpdate(
    req.params.id,
    { status: 'Inactive' },
    { new: true }
  );

  if (!member) {
    return next(new AppError('No member found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getMemberLoans = catchAsync(async (req, res, next) => {
  const loans = await Loan.find({ member: req.params.id })
    .populate('book')
    .populate('bookCopy');

  res.status(200).json({
    status: 'success',
    results: loans.length,
    data: {
      loans
    }
  });
});

exports.getMemberFines = catchAsync(async (req, res, next) => {
  const fines = await Fine.find({ member: req.params.id, paymentStatus: 'Unpaid' });

  res.status(200).json({
    status: 'success',
    results: fines.length,
    data: {
      fines
    }
  });
});

exports.upgradeMemberTier = catchAsync(async (req, res, next) => {
  const { tier } = req.body;
  const member = await Member.findByIdAndUpdate(
    req.params.id,
    { membershipTier: tier },
    { new: true, runValidators: true }
  );

  if (!member) {
    return next(new AppError('No member found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      member
    }
  });
});