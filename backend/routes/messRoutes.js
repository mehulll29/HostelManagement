const express = require('express');
const router = express.Router();
const { getMessMenu, updateMessMenu, deleteMessMenu } = require('../controllers/messController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getMessMenu)
  .post(adminOnly, updateMessMenu);

router.route('/:id')
  .put(adminOnly, updateMessMenu)
  .delete(adminOnly, deleteMessMenu);

module.exports = router;
