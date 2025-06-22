const express = require('express');
const router = express.Router();
const {
  getLoans,
  lendBook,
  returnBook
} = require('../controllers/lendingController');

router.get('/', getLoans);
router.post('/', lendBook);
router.put('/return/:id', returnBook);

module.exports = router;
