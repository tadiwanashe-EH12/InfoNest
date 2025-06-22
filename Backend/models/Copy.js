const db = require('./db');

exports.add = ({ book_id, barcode }) => db.query(
  'INSERT INTO book_copies (book_id, barcode) VALUES (?, ?)',
  [book_id, barcode]
);

exports.updateStatus = (copyId, status) => db.query(
  'UPDATE book_copies SET status = ? WHERE id = ?',
  [status, copyId]
);

exports.getByBook = (book_id) => db.query(
  'SELECT * FROM book_copies WHERE book_id = ?',
  [book_id]
);
