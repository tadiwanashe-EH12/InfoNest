const Member = require('../models/Member');
const Loan = require('../models/Loan');
const Fine = require('../models/Fine');

exports.deactivateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const hasActiveLoans = await Loan.exists({ member: id, returnDate: null });
    const hasUnpaidFines = await Fine.exists({ member: id, status: 'Unpaid' });

    if (hasActiveLoans || hasUnpaidFines) {
      return res.status(400).json({ error: 'Cannot deactivate: outstanding loans or fines' });
    }

    const member = await Member.findByIdAndUpdate(id, { status: 'Inactive' }, { new: true });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
