const BookCopySchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  copyId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Available', 'Borrowed', 'Lost'], default: 'Available' },
});

module.exports = mongoose.model('BookCopy', BookCopySchema);