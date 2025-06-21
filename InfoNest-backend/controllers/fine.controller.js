const Fine = require('../models/Fine');

exports.payFine = async (req, res) => {
  try {
    const fine = await Fine.findByIdAndUpdate(
      req.params.id,
      { status: 'Paid' },
      { new: true }
    );
    res.json(fine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
