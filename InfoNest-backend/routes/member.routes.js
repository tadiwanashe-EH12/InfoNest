const router = require('express').Router();
const { deactivateMember } = require('../controllers/member.controller');
router.patch('/deactivate/:id', deactivateMember);
module.exports = router;
