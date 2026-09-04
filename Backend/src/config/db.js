import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = 'mongodb+srv://vinijinodiya_db_user:VmYjntYswrjgFN9F@clustershippnex.3wcv3xd.mongodb.net/?appName=Clustershippnex';

export const dbState = {
  connected: false,
  readyState: 0,
  host: null,
  error: null,
  lastAttempt: null,
};

const connectDB = async () => {
  dbState.lastAttempt = new Date().toISOString();
  try {
    const uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    dbState.connected = true;
    dbState.readyState = mongoose.connection.readyState;
    dbState.host = conn.connection.host;
    dbState.error = null;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    dbState.connected = false;
    dbState.readyState = mongoose.connection.readyState;
    dbState.error = error.message;
    console.error(`Database Connection Error: ${error.message}`);
  }
};

export default connectDB;

