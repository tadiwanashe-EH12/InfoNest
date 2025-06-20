const express = require('express');
const memberController = require('../controllers/memberController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(memberController.getAllMembers)
  .post(memberController.createMember);

router
  .route('/:id')
  .get(memberController.getMember)
  .patch(memberController.updateMember)
  .delete(memberController.deleteMember);

router
  .route('/:id/loans')
  .get(memberController.getMemberLoans);

router
  .route('/:id/fines')
  .get(memberController.getMemberFines);

router
  .route('/:id/upgrade-tier')
  .patch(memberController.upgradeMemberTier);

module.exports = router;