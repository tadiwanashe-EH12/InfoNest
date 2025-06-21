const router = require('express').Router();
const { getActiveLoans } = require('../controllers/report.controller');
const protect = require('../middleware/auth');

router.get('/active-loans', protect, getActiveLoans);

module.exports = router;
