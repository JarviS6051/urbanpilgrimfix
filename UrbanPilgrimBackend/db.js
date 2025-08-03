const mongoose = require('mongoose');

// MongoDB connection URL from environment variable
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected Successfully');
    console.log('Database:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;