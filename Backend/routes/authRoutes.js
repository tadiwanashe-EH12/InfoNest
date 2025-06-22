const express = require('express');
const router = express.Router();
const { loginLibrarian } = require('../controllers/authController');

router.post('/login', loginLibrarian);

module.exports = router;
