const Complaint = require('../models/Complaint');

// @desc    Create complaint (Student)
// @route   POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const { title, category, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const complaint = new Complaint({
      student: req.user._id,
      title,
      category: category || 'Maintenance',
      description,
      priority: priority || 'medium',
      status: 'pending',
    });

    await complaint.save();

    const populatedComplaint = await Complaint.findById(complaint._id).populate('student', 'fullName email rollNumber room');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: populatedComplaint,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get complaints (Student gets own, Admin gets all)
// @route   GET /api/complaints
const getComplaints = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    const complaints = await Complaint.find(query)
      .populate({
        path: 'student',
        select: 'fullName email rollNumber room',
        populate: { path: 'room', select: 'number' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update complaint status / resolution (Admin) or edit (Student)
// @route   PUT /api/complaints/:id
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (req.user.role === 'student') {
      if (complaint.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this complaint' });
      }
      if (req.body.title) complaint.title = req.body.title;
      if (req.body.description) complaint.description = req.body.description;
      if (req.body.category) complaint.category = req.body.category;
      if (req.body.priority) complaint.priority = req.body.priority;
    } else {
      // Admin update
      if (req.body.status) complaint.status = req.body.status;
      if (req.body.resolutionNote !== undefined) complaint.resolutionNote = req.body.resolutionNote;
      if (req.body.status === 'resolved') {
        complaint.resolutionDate = new Date();
      }
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id).populate({
      path: 'student',
      select: 'fullName email rollNumber room',
      populate: { path: 'room', select: 'number' },
    });

    res.json({ success: true, message: 'Complaint updated successfully', complaint: updatedComplaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (req.user.role === 'student' && complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this complaint' });
    }

    await complaint.deleteOne();
    res.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaint,
  deleteComplaint,
};
