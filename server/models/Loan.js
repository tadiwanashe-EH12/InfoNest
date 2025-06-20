const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  bookCopy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookCopy',
    required: [true, 'Book copy reference is required']
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book reference is required']
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Member reference is required']
  },
  checkoutDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 14);
      return date;
    }
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Returned', 'Overdue', 'Lost'],
    default: 'Active'
  },
  fine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fine'
  },
  renewed: {
    type: Boolean,
    default: false
  }
});

// Indexes for faster queries
loanSchema.index({ member: 1, status: 1 });
loanSchema.index({ bookCopy: 1, status: 1 });

// Pre-save hook to update status based on dates
loanSchema.pre('save', function(next) {
  if (this.returnDate) {
    this.status = 'Returned';
  } else if (this.dueDate < new Date() && this.status === 'Active') {
    this.status = 'Overdue';
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);