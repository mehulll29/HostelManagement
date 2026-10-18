const mongoose = require('mongoose');
const dns = require('dns');

// Prevent querySrv ECONNREFUSED on Windows with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // ignore if restricted
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostel_management';
  const isAtlas = uri.includes('mongodb+srv://') || uri.includes('mongodb.net');
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isAtlas ? 10000 : 3000
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.log(`[MongoDB Local] Could not connect to local MongoDB (${err.message}). Starting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[MongoDB Memory] In-Memory MongoDB running at: ${mongoUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB Error] Failed to connect to MongoDB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
