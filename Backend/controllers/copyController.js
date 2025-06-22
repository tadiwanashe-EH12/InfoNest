const Copy = require('../models/Copy');

exports.addCopy = async (req, res) => {
  const { book_id, barcode } = req.body;
  try {
    await Copy.add({ book_id, barcode });
    res.status(201).json({ message: 'Copy added' });
  } catch (err) {
    res.status(400).json({ error: 'Copy creation failed', details: err.message });
  }
};

exports.updateCopyStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await Copy.updateStatus(id, status);
    res.json({ message: 'Copy status updated' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update copy', details: err.message });
  }
};

exports.getCopiesByBook = async (req, res) => {
  const { book_id } = req.params;
  try {
    const [copies] = await Copy.getByBook(book_id);
    res.json(copies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch copies' });
  }
};
