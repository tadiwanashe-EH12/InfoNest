const Book = require('../models/Book');
const BookCopy = require('../models/BookCopy');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Book.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const books = await features.query.populate({
    path: 'copies',
    match: { status: 'Available' }
  });

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books
    }
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate('copies');

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book
    }
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  const newBook = await Book.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      book: newBook
    }
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book
    }
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getBookCopies = catchAsync(async (req, res, next) => {
  const copies = await BookCopy.find({ book: req.params.id });

  res.status(200).json({
    status: 'success',
    results: copies.length,
    data: {
      copies
    }
  });
});

exports.createBookCopy = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  const newCopy = await BookCopy.create({
    ...req.body,
    book: req.params.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      copy: newCopy
    }
  });
});

exports.getBookRecommendations = catchAsync(async (req, res, next) => {
  // This would integrate with an AI service in production
  const recommendedBooks = await Book.aggregate([
    { $sample: { size: 5 } },
    { $match: { _id: { $ne: req.params.id } } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      books: recommendedBooks
    }
  });
});