const express = require('express');
const fineController = require('../controllers/fineController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(fineController.getAllFines);

router
  .route('/:id')
  .get(fineController.getFine);

router
  .route('/:id/pay')
  .patch(fineController.payFine);

router
  .route('/:id/waive')
  .patch(fineController.waiveFine);

router
  .route('/members/:memberId')
  .get(fineController.getMemberFines);

module.exports = router;