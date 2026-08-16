const User = require('./models/User');
const Room = require('./models/Room');
const MessMenu = require('./models/MessMenu');
const Complaint = require('./models/Complaint');
const Leave = require('./models/Leave');

const seedInitialData = async () => {
  try {
    // Check if admin exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    let adminUser;
    if (adminCount === 0) {
      adminUser = await User.create({
        fullName: 'System Administrator',
        email: 'admin@hostelhub.com',
        password: 'admin123',
        role: 'admin',
        phone: '+919876543210',
      });
      console.log('[Seed] Admin account created (admin@hostelhub.com / admin123)');
    }

    // Seed Rooms
    const roomCount = await Room.countDocuments();
    let sampleRoom;
    if (roomCount === 0) {
      const rooms = await Room.insertMany([
        { number: 'A-101', block: 'A Block', type: 'AC', capacity: 2, occupiedBeds: 0 },
        { number: 'A-102', block: 'A Block', type: 'Non-AC', capacity: 2, occupiedBeds: 0 },
        { number: 'B-201', block: 'B Block', type: 'AC', capacity: 1, occupiedBeds: 0 },
        { number: 'B-202', block: 'B Block', type: 'Non-AC', capacity: 3, occupiedBeds: 0 },
      ]);
      sampleRoom = rooms[0];
      console.log('[Seed] Sample rooms created (A-101, A-102, B-201, B-202)');
    } else {
      sampleRoom = await Room.findOne({ number: 'A-101' });
    }

    // Seed Sample Student
    const studentCount = await User.countDocuments({ role: 'student' });
    let sampleStudent;
    if (studentCount === 0) {
      sampleStudent = await User.create({
        fullName: 'Mehul Patel',
        email: 'mehul@example.com',
        password: 'mehul123',
        role: 'student',
        phone: '+919876543210',
        rollNumber: 'MCA055',
        collegeName: 'Dharmsinh Desai University',
        course: 'MCA',
        semester: '6',
        fatherName: 'Hasmukh Patel',
        fatherPhone: '+919876543213',
        room: sampleRoom ? sampleRoom._id : null,
      });

      if (sampleRoom) {
        sampleRoom.occupants.push(sampleStudent._id);
        sampleRoom.occupiedBeds = 1;
        await sampleRoom.save();
      }
      console.log('[Seed] Sample student created (mehul@example.com / mehul123)');
    } else {
      sampleStudent = await User.findOne({ email: 'mehul@example.com' });
    }

    // Seed Mess Menu
    const messCount = await MessMenu.countDocuments();
    if (messCount === 0) {
      const defaultWeeklyMenu = [
        {
          day: 'Monday',
          breakfast: 'Poha, Sev, Tea / Coffee',
          lunch: 'Roti, Paneer Masala, Dal Fry, Jeera Rice',
          snacks: 'Samosa, Mint Chutney, Tea',
          dinner: 'Roti, Mix Veg, Rice, Gulab Jamun',
        },
        {
          day: 'Tuesday',
          breakfast: 'Idli Sambhar, Coconut Chutney',
          lunch: 'Roti, Chana Masala, Rice, Salad',
          snacks: 'Biscuits, Tea',
          dinner: 'Roti, Aloo Gobi, Rice, Dal',
        },
        {
          day: 'Wednesday',
          breakfast: 'Aloo Paratha, Curd, Pickle',
          lunch: 'Roti, Rajma, Veg Pulav, Boondi Raita',
          snacks: 'Vada Pav, Tea',
          dinner: 'Roti, Kadhai Paneer, Rice, Ice Cream',
        },
        {
          day: 'Thursday',
          breakfast: 'Upma, Tea / Coffee',
          lunch: 'Roti, Bhindi Fry, Dal Tadka, Rice',
          snacks: 'Pakoda, Green Chutney',
          dinner: 'Roti, Sev Tamatar, Rice, Suji Halwa',
        },
        {
          day: 'Friday',
          breakfast: 'Uttapam, Sambhar',
          lunch: 'Roti, Egg Curry / Paneer, Rice, Salad',
          snacks: 'Sandwich, Tea',
          dinner: 'Special Veg Biryani, Raita, Rasgulla',
        },
        {
          day: 'Saturday',
          breakfast: 'Puri Bhaji, Tea',
          lunch: 'Roti, Dal Makhani, Veg Pulao, Curd',
          snacks: 'Bhel Puri, Tea',
          dinner: 'Roti, Malai Kofta, Rice, Kheer',
        },
        {
          day: 'Sunday',
          breakfast: 'Masala Dosa, Sambhar',
          lunch: 'Special Sunday Thali, Sweet, Ice Cream',
          snacks: 'French Fries, Coffee',
          dinner: 'Roti, Dal Khichdi, Kadhi, Papad',
        },
      ];
      await MessMenu.insertMany(defaultWeeklyMenu);
      console.log('[Seed] Weekly Mess Menu seeded successfully');
    }

    // Seed sample complaint & leave if needed
    if (sampleStudent) {
      const complaintCount = await Complaint.countDocuments();
      if (complaintCount === 0) {
        await Complaint.create({
          student: sampleStudent._id,
          title: 'AC Remote Not Working',
          category: 'Electrical',
          description: 'The AC remote in Room A-101 display is faded and buttons unresponsive.',
          priority: 'medium',
          status: 'pending',
        });
      }

      const leaveCount = await Leave.countDocuments();
      if (leaveCount === 0) {
        await Leave.create({
          student: sampleStudent._id,
          reason: 'Family Function & Hometown Visit',
          startDate: new Date(),
          endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          status: 'pending',
        });
      }
    }
  } catch (err) {
    console.error('[Seed Error] Failed to seed initial data:', err.message);
  }
};

module.exports = seedInitialData;
