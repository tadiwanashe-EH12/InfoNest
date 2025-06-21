const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  membershipDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
});

module.exports = mongoose.model('Member', MemberSchema);

exports.createMember = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    const existing = await Member.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ error: 'Email or phone already exists' });
    }

    const member = new Member({ fullName, email, phone });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
