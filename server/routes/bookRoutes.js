const express = require('express');
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(authController.protect, bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(authController.protect, bookController.updateBook)
  .delete(authController.protect, bookController.deleteBook);

router
  .route('/:id/copies')
  .get(bookController.getBookCopies)
  .post(authController.protect, bookController.createBookCopy);

router
  .route('/:id/recommendations')
  .get(bookController.getBookRecommendations);

module.exports = router;