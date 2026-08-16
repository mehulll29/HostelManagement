const express = require('express');
const router = express.Router();
const {
  createLeave,
  getLeaves,
  updateLeave,
  deleteLeave,
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getLeaves)
  .post(createLeave);

router.route('/:id')
  .put(updateLeave)
  .delete(deleteLeave);

module.exports = router;
