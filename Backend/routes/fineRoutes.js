const express = require('express');
const router = express.Router();
const {
  getFines,
  createFine,
  markFinePaid
} = require('../controllers/fineController');

router.get('/', getFines);
router.post('/', createFine);
router.put('/pay/:id', markFinePaid);

module.exports = router;
