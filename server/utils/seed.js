const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Book = require('../models/Book');
const BookCopy = require('../models/BookCopy');
const Member = require('../models/Member');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => console.log('DB connection successful for seeding!'));

const seedUsers = async () => {
  try {
    await User.deleteMany();

    const librarian = await User.create({
      email: 'librarian@library.com',
      password: 'SecureLib@123',
      role: 'librarian'
    });

    console.log('Users seeded successfully!');
  } catch (err) {
    console.error(err);
  }
};

const seedBooks = async () => {
  try {
    await Book.deleteMany();
    await BookCopy.deleteMany();

    const books = [
      {
        isbn: '978-0061120084',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        publisher: 'HarperCollins',
        publicationYear: 1960,
        genre: ['Fiction', 'Classic']
      },
      // Add more books as needed
    ];

    const createdBooks = await Book.insertMany(books);

    // Create copies for each book
    for (const book of createdBooks) {
      await BookCopy.create({
        copyId: `COPY-${book.isbn}-001`,
        book: book._id,
        status: 'Available'
      });
    }

    console.log('Books and copies seeded successfully!');
  } catch (err) {
    console.error(err);
  }
};

const seedMembers = async () => {
  try {
    await Member.deleteMany();

    const members = [
      {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        membershipTier: 'Standard'
      },
      // Add more members as needed
    ];

    await Member.insertMany(members);

    console.log('Members seeded successfully!');
  } catch (err) {
    console.error(err);
  }
};

const seedAll = async () => {
  await seedUsers();
  await seedBooks();
  await seedMembers();
  process.exit();
};

seedAll();