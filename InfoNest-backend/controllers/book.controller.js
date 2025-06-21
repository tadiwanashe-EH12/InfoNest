const Book = require('../models/Book');
const BookCopy = require('../models/BookCopy');

exports.createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const copies = await BookCopy.find({ book: req.params.id });
    if (copies.length > 0) {
      return res.status(400).json({ error: 'Cannot delete book with existing copies' });
    }
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
