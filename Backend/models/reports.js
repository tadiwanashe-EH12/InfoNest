const db = require('./db');

exports.getOverdueLoans = () => db.query(`
  SELECT loans.id, members.full_name AS member, books.title AS book,
         loans.due_on, DATEDIFF(CURRENT_DATE, loans.due_on) AS days_overdue
  FROM loans
  JOIN members ON loans.member_id = members.id
  JOIN books ON loans.book_id = books.id
  WHERE loans.returned_on IS NULL AND loans.due_on < CURRENT_DATE
`);

exports.getUnpaidFines = () => db.query(`
  SELECT fines.id, members.full_name AS member, fines.amount, fines.reason
  FROM fines
  JOIN members ON fines.member_id = members.id
  WHERE fines.paid = FALSE
`);

exports.getMemberHistory = (member_id) => db.query(`
  SELECT b.title, l.lent_on, l.due_on, l.returned_on
  FROM loans l
  JOIN books b ON l.book_id = b.id
  WHERE l.member_id = ?
  ORDER BY l.lent_on DESC
`);
