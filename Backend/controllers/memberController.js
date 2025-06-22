require('../models/db')
const [loans] = await db.query(
  'SELECT COUNT(*) AS total FROM loans WHERE member_id = ? AND returned_on IS NULL',
  [id]
);

const [fines] = await db.query(
  'SELECT COUNT(*) AS total FROM fines WHERE member_id = ? AND paid = FALSE',
  [id]
);

if (loans[0].total > 0 || fines[0].total > 0) {
  return res.status(400).json({ message: 'Member has active loans or unpaid fines' });
}

await Member.softDelete(id);
res.json({ message: 'Member inactivated' });
