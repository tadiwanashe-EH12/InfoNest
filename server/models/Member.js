const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  membershipDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  membershipTier: {
    type: String,
    enum: ['Standard', 'Premium', 'VIP'],
    default: 'Standard'
  },
  biometricId: {
    type: String,
    unique: true,
    sparse: true
  },
  profileImage: {
    type: String
  },
  readingPreferences: {
    type: [String]
  },
  totalLoans: {
    type: Number,
    default: 0
  },
  unpaidFines: {
    type: Number,
    default: 0
  }
});

// Prevent duplicate emails or phones
memberSchema.index({ email: 1 }, { unique: true });
memberSchema.index({ phone: 1 }, { unique: true });

// Pre-save hook to hash password if modified
memberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
memberSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Pre-remove hook to check for active loans or unpaid fines
memberSchema.pre('remove', async function(next) {
  const activeLoans = await this.model('Loan').countDocuments({ 
    member: this._id, 
    returnDate: { $exists: false } 
  });
  
  const unpaidFines = await this.model('Fine').countDocuments({ 
    member: this._id, 
    paymentStatus: 'Unpaid' 
  });

  if (activeLoans > 0 || unpaidFines > 0) {
    next(new Error('Cannot delete member with active loans or unpaid fines'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Member', memberSchema);