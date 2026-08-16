const User = require('../models/User');
const Room = require('../models/Room');

// @desc    Register a new student with login credentials (Admin action)
// @route   POST /api/students
const registerStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      rollNumber,
      collegeName,
      course,
      semester,
      fatherName,
      fatherPhone,
      dateOfBirth,
      roomId,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    let allocatedRoom = null;
    if (roomId) {
      allocatedRoom = await Room.findById(roomId);
      if (allocatedRoom && allocatedRoom.occupiedBeds >= allocatedRoom.capacity) {
        return res.status(400).json({ success: false, message: 'Selected room is already full' });
      }
    }

    const student = new User({
      fullName,
      email,
      password,
      role: 'student',
      phone: phone || '',
      rollNumber: rollNumber || '',
      collegeName: collegeName || 'Dharmsinh Desai University',
      course: course || 'MCA',
      semester: semester || '1',
      fatherName: fatherName || '',
      fatherPhone: fatherPhone || '',
      dateOfBirth: dateOfBirth || '',
      room: allocatedRoom ? allocatedRoom._id : null,
    });

    await student.save();

    if (allocatedRoom) {
      allocatedRoom.occupants.push(student._id);
      allocatedRoom.occupiedBeds = allocatedRoom.occupants.length;
      await allocatedRoom.save();
    }

    const studentData = await User.findById(student._id).select('-password').populate('room');

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      student: studentData,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all students
// @route   GET /api/students
const getAllStudents = async (req, res) => {
  try {
    const { search, course, semester } = req.query;
    let query = { role: 'student' };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (course) query.course = course;
    if (semester) query.semester = semester;

    const students = await User.find(query).select('-password').populate('room').sort({ createdAt: -1 });

    res.json({ success: true, count: students.length, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single student details
// @route   GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password').populate('room');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update student details / room assignment (Admin)
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const {
      fullName,
      email,
      password,
      phone,
      rollNumber,
      collegeName,
      course,
      semester,
      fatherName,
      fatherPhone,
      newRoomId,
    } = req.body;

    if (fullName) student.fullName = fullName;
    if (email) student.email = email;
    if (password) student.password = password; // Will be hashed via pre-save middleware
    if (phone !== undefined) student.phone = phone;
    if (rollNumber !== undefined) student.rollNumber = rollNumber;
    if (collegeName) student.collegeName = collegeName;
    if (course) student.course = course;
    if (semester) student.semester = semester;
    if (fatherName !== undefined) student.fatherName = fatherName;
    if (fatherPhone !== undefined) student.fatherPhone = fatherPhone;

    // Room re-allocation logic
    if (newRoomId !== undefined && newRoomId !== String(student.room)) {
      // Remove from old room
      if (student.room) {
        await Room.findByIdAndUpdate(student.room, {
          $pull: { occupants: student._id },
          $inc: { occupiedBeds: -1 },
        });
      }

      if (newRoomId) {
        const targetRoom = await Room.findById(newRoomId);
        if (targetRoom) {
          if (targetRoom.occupiedBeds >= targetRoom.capacity) {
            return res.status(400).json({ success: false, message: 'New room is already full' });
          }
          targetRoom.occupants.push(student._id);
          targetRoom.occupiedBeds = targetRoom.occupants.length;
          await targetRoom.save();
          student.room = targetRoom._id;
        }
      } else {
        student.room = null;
      }
    }

    await student.save();
    const updatedStudent = await User.findById(student._id).select('-password').populate('room');

    res.json({
      success: true,
      message: 'Student updated successfully',
      student: updatedStudent,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete student record and release room bed
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (student.room) {
      await Room.findByIdAndUpdate(student.room, {
        $pull: { occupants: student._id },
        $inc: { occupiedBeds: -1 },
      });
    }

    await student.deleteOne();

    res.json({ success: true, message: 'Student record deleted and room bed released' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
