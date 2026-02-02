const express = require('express');
const router = express.Router();
const { getMembers, createMember, deleteMember } = require('../controllers/memberController');
const  protect  = require('../middleware/authMiddleware');

router.use(protect); // All routes require authentication

router.route('/')
  .get(getMembers)
  .post(createMember);

router.route('/:id')
  .delete(deleteMember);

module.exports = router;
