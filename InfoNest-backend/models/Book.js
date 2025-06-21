const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  isbn: { type: String, required: true, unique: true },
  title: String,
  author: String,
  publisher: String,
  publicationYear: Number,
  genre: String,
});

module.exports = mongoose.model('Book', BookSchema);