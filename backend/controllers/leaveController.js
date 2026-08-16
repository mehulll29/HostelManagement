const Leave = require('../models/Leave');

// @desc    Apply for leave (Student)
// @route   POST /api/leaves
const createLeave = async (req, res) => {
  try {
    const { reason, startDate, endDate } = req.body;

    if (!reason || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Reason, start date, and end date are required' });
    }

    const leave = new Leave({
      student: req.user._id,
      reason,
      startDate,
      endDate,
      status: 'pending',
    });

    await leave.save();
    const populatedLeave = await Leave.findById(leave._id).populate('student', 'fullName email rollNumber room');

    res.status(201).json({ success: true, message: 'Leave request submitted', leave: populatedLeave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get leave requests (Student gets own, Admin gets all)
// @route   GET /api/leaves
const getLeaves = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    const leaves = await Leave.find(query)
      .populate({
        path: 'student',
        select: 'fullName email rollNumber room',
        populate: { path: 'room', select: 'number' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: leaves.length, leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update leave status (Admin approve/reject or Student update)
// @route   PUT /api/leaves/:id
const updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    if (req.user.role === 'student') {
      if (leave.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this leave request' });
      }
      if (leave.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Cannot edit processed leave request' });
      }
      if (req.body.reason) leave.reason = req.body.reason;
      if (req.body.startDate) leave.startDate = req.body.startDate;
      if (req.body.endDate) leave.endDate = req.body.endDate;
    } else {
      // Admin approve / reject
      if (req.body.status) leave.status = req.body.status;
      if (req.body.adminRemark !== undefined) leave.adminRemark = req.body.adminRemark;
    }

    await leave.save();

    const updatedLeave = await Leave.findById(leave._id).populate({
      path: 'student',
      select: 'fullName email rollNumber room',
      populate: { path: 'room', select: 'number' },
    });

    res.json({ success: true, message: 'Leave request updated successfully', leave: updatedLeave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete leave request
// @route   DELETE /api/leaves/:id
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    if (req.user.role === 'student' && leave.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this leave request' });
    }

    await leave.deleteOne();
    res.json({ success: true, message: 'Leave request deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createLeave,
  getLeaves,
  updateLeave,
  deleteLeave,
};
