const db = require('./db');

exports.getAll = () => db.query(`
  SELECT loans.*, members.full_name AS member, books.title AS book
  FROM loans
  JOIN members ON loans.member_id = members.id
  JOIN books ON loans.book_id = books.id
  WHERE returned_on IS NULL
`);

exports.create = ({ member_id, book_id, copy_number }) => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  return db.query(
    'INSERT INTO loans (member_id, book_id, copy_number, due_on) VALUES (?, ?, ?, ?)',
    [member_id, book_id, copy_number, dueDate.toISOString().split('T')[0]]
  );
};

exports.returnLoan = (loanId) =>
  db.query('UPDATE loans SET returned_on = CURRENT_DATE WHERE id = ?', [loanId]);
