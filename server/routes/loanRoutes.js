const express = require('express');
const loanController = require('../controllers/loanController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(loanController.getAllLoans)
  .post(loanController.checkoutBook);

router.get('/overdue', loanController.getOverdueLoans);

router
  .route('/:id/return')
  .patch(loanController.returnBook);

router
  .route('/:id/renew')
  .patch(loanController.renewLoan);

module.exports = router;