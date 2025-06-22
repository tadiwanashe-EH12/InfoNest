const express = require('express');
const router = express.Router();
const {
  addCopy,
  updateCopyStatus,
  getCopiesByBook
} = require('../controllers/copyController');

router.post('/', addCopy);
router.put('/:id/status', updateCopyStatus);
router.get('/book/:book_id', getCopiesByBook);

module.exports = router;
