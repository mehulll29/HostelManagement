const express = require('express');
const router = express.Router();
const {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect); // All student routes require authentication

router.route('/')
  .get(adminOnly, getAllStudents)
  .post(adminOnly, registerStudent);

router.route('/:id')
  .get(getStudentById)
  .put(adminOnly, updateStudent)
  .delete(adminOnly, deleteStudent);

module.exports = router;
