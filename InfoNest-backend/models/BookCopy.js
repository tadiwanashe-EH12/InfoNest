const BookCopySchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  copyId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Available', 'Borrowed', 'Lost'], default: 'Available' },
  history: [
    {
      member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
      action: { type: String, enum: ['Borrowed', 'Returned'], required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});
copy.history.push({ member: member._id, action: 'Borrowed' });
await copy.save();
copy.history.push({ member: loan.member._id, action: 'Returned' });



module.exports = mongoose.model('BookCopy', BookCopySchema);

