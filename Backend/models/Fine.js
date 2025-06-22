const db = require('./db');

exports.getAll = () => db.query(`
  SELECT fines.*, members.full_name AS member
  FROM fines
  JOIN members ON fines.member_id = members.id
  ORDER BY issued_on DESC
`);

exports.create = (fine) => db.query(
  'INSERT INTO fines (member_id, amount, reason) VALUES (?, ?, ?)',
  [fine.member_id, fine.amount, fine.reason]
);

exports.markPaid = (id) => db.query('UPDATE fines SET paid = TRUE WHERE id = ?', [id]);
