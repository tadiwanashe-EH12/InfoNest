const mongoose = require('mongoose');

const LibrarianSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

module.exports = mongoose.model('Librarian', LibrarianSchema);
