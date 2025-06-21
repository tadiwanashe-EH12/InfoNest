const router = require('express').Router();
const { payFine } = require('../controllers/fine.controller');
const protect = require('../middleware/auth');

router.patch('/pay/:id', protect, payFine);

module.exports = router;
