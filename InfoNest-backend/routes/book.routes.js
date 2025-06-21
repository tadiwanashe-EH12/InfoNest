const router = require('express').Router();
const { createBook, deleteBook } = require('../controllers/book.controller');
const protect = require('../middleware/auth');

router.post('/', protect, createBook);
router.delete('/:id', protect, deleteBook);
module.exports = router;
