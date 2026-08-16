const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getComplaints)
  .post(createComplaint);

router.route('/:id')
  .put(updateComplaint)
  .delete(deleteComplaint);

module.exports = router;
