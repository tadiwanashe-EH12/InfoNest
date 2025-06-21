const router = require('express').Router();
const { checkoutBook, returnBook } = require('../controllers/loan.controller');
const protect = require('../middleware/auth');

router.post('/checkout', protect, checkoutBook);
router.patch('/return/:loanId', protect, returnBook);

module.exports = router;
