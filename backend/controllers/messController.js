const MessMenu = require('../models/MessMenu');

// @desc    Get full weekly mess menu
// @route   GET /api/mess
const getMessMenu = async (req, res) => {
  try {
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const menu = await MessMenu.find({});

    // Sort by weekday order
    const sortedMenu = menu.sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));
    res.json({ success: true, count: sortedMenu.length, menu: sortedMenu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update or create day mess menu (Admin)
// @route   POST /api/mess / PUT /api/mess/:id
const updateMessMenu = async (req, res) => {
  try {
    const { day, breakfast, lunch, snacks, dinner } = req.body;

    if (!day) {
      return res.status(400).json({ success: false, message: 'Day of week is required' });
    }

    let menuItem = await MessMenu.findOne({ day });

    if (menuItem) {
      menuItem.breakfast = breakfast !== undefined ? breakfast : menuItem.breakfast;
      menuItem.lunch = lunch !== undefined ? lunch : menuItem.lunch;
      menuItem.snacks = snacks !== undefined ? snacks : menuItem.snacks;
      menuItem.dinner = dinner !== undefined ? dinner : menuItem.dinner;
      await menuItem.save();
    } else {
      menuItem = new MessMenu({ day, breakfast, lunch, snacks, dinner });
      await menuItem.save();
    }

    res.json({ success: true, message: `Mess menu for ${day} updated successfully`, menuItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete mess menu entry
// @route   DELETE /api/mess/:id
const deleteMessMenu = async (req, res) => {
  try {
    const menuItem = await MessMenu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu entry not found' });
    }

    await menuItem.deleteOne();
    res.json({ success: true, message: `Mess menu entry for ${menuItem.day} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMessMenu, updateMessMenu, deleteMessMenu };
