const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (member, statusCode, res) => {
  const token = signToken(member._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  member.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      member
    }
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if member exists and password is correct
  const member = await Member.findOne({ email }).select('+password');

  if (!member || !(await member.correctPassword(password, member.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(member, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if member still exists
  const currentMember = await Member.findById(decoded.id);
  if (!currentMember) {
    return next(
      new AppError('The member belonging to this token does no longer exist.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.member = currentMember;
  res.locals.member = currentMember;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if member still exists
      const currentMember = await Member.findById(decoded.id);
      if (!currentMember) {
        return next();
      }

      // THERE IS A LOGGED IN MEMBER
      res.locals.member = currentMember;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};