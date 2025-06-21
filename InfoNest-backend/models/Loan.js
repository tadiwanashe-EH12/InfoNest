const LoanSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  bookCopy: { type: mongoose.Schema.Types.ObjectId, ref: 'BookCopy', required: true },
  checkoutDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  returnDate: { type: Date },
  fine: { type: mongoose.Schema.Types.ObjectId, ref: 'Fine' },
});

module.exports = mongoose.model('Loan', LoanSchema);