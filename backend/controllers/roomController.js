const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Get all rooms
// @route   GET /api/rooms
const getRooms = async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const rooms = await Room.find(query).populate('occupants', 'fullName email rollNumber phone').sort({ number: 1 });
    res.json({ success: true, count: rooms.length, rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
const createRoom = async (req, res) => {
  try {
    const { number, block, type, capacity } = req.body;

    if (!number || !capacity) {
      return res.status(400).json({ success: false, message: 'Room number and capacity are required' });
    }

    const existingRoom = await Room.findOne({ number });
    if (existingRoom) {
      return res.status(400).json({ success: false, message: `Room ${number} already exists` });
    }

    const room = new Room({
      number,
      block: block || 'A Block',
      type: type || 'Non-AC',
      capacity: Number(capacity),
      occupiedBeds: 0,
      occupants: [],
      status: 'available',
    });

    await room.save();
    res.status(201).json({ success: true, message: 'Room created successfully', room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const { number, block, type, capacity, status } = req.body;

    if (number) room.number = number;
    if (block) room.block = block;
    if (type) room.type = type;
    if (capacity) {
      if (Number(capacity) < room.occupiedBeds) {
        return res.status(400).json({
          success: false,
          message: `Capacity cannot be lower than current occupants count (${room.occupiedBeds})`,
        });
      }
      room.capacity = Number(capacity);
    }
    if (status) room.status = status;

    await room.save();
    const updatedRoom = await Room.findById(room._id).populate('occupants', 'fullName email rollNumber phone');

    res.json({ success: true, message: 'Room updated successfully', room: updatedRoom });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.occupants && room.occupants.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active occupants. Please deallocate students first.',
      });
    }

    await room.deleteOne();
    res.json({ success: true, message: `Room ${room.number} deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Allocate student to room
// @route   POST /api/rooms/:id/allocate
const allocateBed = async (req, res) => {
  try {
    const { studentId } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.occupiedBeds >= room.capacity) {
      return res.status(400).json({ success: false, message: 'Room is already at full capacity' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Remove from previous room if allocated
    if (student.room) {
      await Room.findByIdAndUpdate(student.room, {
        $pull: { occupants: student._id },
        $inc: { occupiedBeds: -1 },
      });
    }

    room.occupants.push(student._id);
    room.occupiedBeds = room.occupants.length;
    await room.save();

    student.room = room._id;
    await student.save();

    const updatedRoom = await Room.findById(room._id).populate('occupants', 'fullName email rollNumber phone');
    res.json({ success: true, message: 'Student allocated to room successfully', room: updatedRoom });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Deallocate student from room
// @route   POST /api/rooms/:id/deallocate
const deallocateBed = async (req, res) => {
  try {
    const { studentId } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const student = await User.findById(studentId);
    if (student) {
      student.room = null;
      await student.save();
    }

    room.occupants = room.occupants.filter((occId) => occId.toString() !== studentId);
    room.occupiedBeds = room.occupants.length;
    await room.save();

    const updatedRoom = await Room.findById(room._id).populate('occupants', 'fullName email rollNumber phone');
    res.json({ success: true, message: 'Student deallocated from room', room: updatedRoom });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  allocateBed,
  deallocateBed,
};
