const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const [rows] = await Book.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch books' });
  }
};

exports.createBook = async (req, res) => {
  const { title, author, isbn } = req.body;
  try {
    await Book.create({ title, author, isbn });
    res.status(201).json({ message: 'Book added' });
  } catch (err) {
    res.status(400).json({ error: 'Book creation failed', details: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const id = req.params.id;
  const { title, author, isbn } = req.body;
  try {
    await Book.update(id, { title, author, isbn });
    res.json({ message: 'Book updated' });
  } catch (err) {
    res.status(400).json({ error: 'Update failed', details: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  const id = req.params.id;
  try {
    await Book.remove(id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed', details: err.message });
  }
  const [copies] = await db.query(
  'SELECT COUNT(*) AS total FROM book_copies WHERE book_id = ?',
  [id]
);

if (copies[0].total > 0) {
  return res.status(400).json({ message: 'Cannot delete: copies still exist' });
}

await Book.remove(id);
res.json({ message: 'Book deleted' });

};
