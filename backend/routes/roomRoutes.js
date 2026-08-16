const express = require('express');
const router = express.Router();
const {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  allocateBed,
  deallocateBed,
} = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getRooms)
  .post(adminOnly, createRoom);

router.route('/:id')
  .put(adminOnly, updateRoom)
  .delete(adminOnly, deleteRoom);

router.post('/:id/allocate', adminOnly, allocateBed);
router.post('/:id/deallocate', adminOnly, deallocateBed);

module.exports = router;
