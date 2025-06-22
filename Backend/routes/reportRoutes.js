const express = require('express');
const router = express.Router();
const {
  getOverdueLoans,
  getUnpaidFines,
  getMemberHistory
} = require('../controllers/reportController');

router.get('/overdue-loans', getOverdueLoans);
router.get('/unpaid-fines', getUnpaidFines);
router.get('/member-history/:id', getMemberHistory);

module.exports = router;
