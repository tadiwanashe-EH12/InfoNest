const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: [true, 'Loan reference is required']
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Member reference is required']
  },
  amount: {
    type: Number,
    required: [true, 'Fine amount is required'],
    min: [0, 'Fine amount cannot be negative']
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partially Paid', 'Waived'],
    default: 'Unpaid'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Digital Wallet', 'Bank Transfer']
  },
  transactionId: {
    type: String
  }
});

// Pre-save hook to update member's unpaid fines
fineSchema.pre('save', async function(next) {
  if (this.isModified('paymentStatus') {
    const Member = mongoose.model('Member');
    const member = await Member.findById(this.member);
    
    if (this.paymentStatus === 'Paid' || this.paymentStatus === 'Waived') {
      member.unpaidFines -= this.amount;
    } else if (this.paymentStatus === 'Unpaid') {
      member.unpaidFines += this.amount;
    }
    
    await member.save();
  }
  next();
});

module.exports = mongoose.model('Fine', fineSchema);