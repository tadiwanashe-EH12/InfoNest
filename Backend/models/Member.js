const db = require('./db');

exports.getAll = () => db.query('SELECT * FROM members WHERE status = "Active"');

exports.getById = (id) => db.query('SELECT * FROM members WHERE id = ?', [id]);

exports.create = (member) => db.query(
  'INSERT INTO members (full_name, email, phone) VALUES (?, ?, ?)',
  [member.full_name, member.email, member.phone]
);

exports.update = (id, member) => db.query(
  'UPDATE members SET full_name = ?, email = ?, phone = ? WHERE id = ?',
  [member.full_name, member.email, member.phone, id]
);

exports.softDelete = (id) => db.query(
  'UPDATE members SET status = "Inactive" WHERE id = ?',
  [id]
);
