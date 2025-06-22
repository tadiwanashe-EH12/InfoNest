const db = require('./db');

exports.getAll = () => db.query('SELECT * FROM books');

exports.getById = (id) => db.query('SELECT * FROM books WHERE id = ?', [id]);

exports.create = (book) => db.query(
  'INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)',
  [book.title, book.author, book.isbn]
);

exports.update = (id, book) => db.query(
  'UPDATE books SET title = ?, author = ?, isbn = ? WHERE id = ?',
  [book.title, book.author, book.isbn, id]
);

exports.remove = (id) => db.query('DELETE FROM books WHERE id = ?', [id]);
