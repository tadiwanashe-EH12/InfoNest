exports.addCopy = async (req, res) => {
  try {
    const { bookId, copyId } = req.body;
    const copy = new BookCopy({ book: bookId, copyId });
    await copy.save();
    res.status(201).json(copy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
