const mongoose = require('mongoose');

const bookCopySchema = new mongoose.Schema({
  copyId: {
    type: String,
    required: [true, 'Copy ID is required'],
    unique: true,
    trim: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book reference is required']
  },
  status: {
    type: String,
    enum: ['Available', 'Borrowed', 'Lost', 'Maintenance'],
    default: 'Available'
  },
  location: {
    shelf: String,
    aisle: String,
    floor: Number
  },
  qrCode: {
    type: String,
    unique: true
  },
  acquisitionDate: {
    type: Date,
    default: Date.now
  },
  condition: {
    type: String,
    enum: ['New', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  }
});

module.exports = mongoose.model('BookCopy', bookCopySchema);