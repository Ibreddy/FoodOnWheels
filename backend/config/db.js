const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodonwheels';
    console.log(`Connecting to MongoDB at ${connStr}...`);
    
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection warning:', err.message);
    console.warn('Backend server running. Ensure local MongoDB service is active on mongodb://127.0.0.1:27017/foodonwheels');
  }
};

module.exports = connectDB;
