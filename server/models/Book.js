const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true
  },
  publicationYear: {
    type: Number,
    required: [true, 'Publication year is required'],
    min: [1000, 'Publication year must be at least 1000'],
    max: [new Date().getFullYear(), `Publication year cannot be in the future`]
  },
  genre: {
    type: [String],
    required: [true, 'At least one genre is required']
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  summary: {
    type: String,
    trim: true
  },
  aiEmbedding: {
    type: [Number],
    select: false
  },
  digitalTokenId: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for book copies
bookSchema.virtual('copies', {
  ref: 'BookCopy',
  localField: '_id',
  foreignField: 'book'
});

// Pre-remove hook to prevent deletion if copies exist
bookSchema.pre('remove', async function(next) {
  const copiesExist = await this.model('BookCopy').exists({ book: this._id });
  if (copiesExist) {
    next(new Error('Cannot delete book with existing copies'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Book', bookSchema);