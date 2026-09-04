import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MongoDB connection string/environment variable (MONGODB_URI) is missing.');
    return;
  }

  try {
    mongoose.set('autoIndex', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}. Retrying in 5s...`);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;

