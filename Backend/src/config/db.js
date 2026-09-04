import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = 'mongodb+srv://vinijinodiya_db_user:VmYjntYswrjgFN9F@clustershippnex.3wcv3xd.mongodb.net/test?retryWrites=true&w=majority';

export const dbState = {
  connected: false,
  readyState: 0,
  host: null,
  error: null,
  lastAttempt: null,
};

// Monitor connection events
mongoose.connection.on('connected', () => {
  dbState.connected = true;
  dbState.readyState = mongoose.connection.readyState;
  dbState.host = mongoose.connection.host;
  dbState.error = null;
  console.log(`[MongoDB] Event: Connected to ${mongoose.connection.host}`);
});

mongoose.connection.on('error', (err) => {
  dbState.connected = false;
  dbState.readyState = mongoose.connection.readyState;
  dbState.error = err.message;
  console.error(`[MongoDB] Event Error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  dbState.connected = false;
  dbState.readyState = mongoose.connection.readyState;
  console.warn('[MongoDB] Event: Disconnected');
});

const connectDB = async () => {
  dbState.lastAttempt = new Date().toISOString();
  try {
    const uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
    mongoose.set('autoIndex', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    dbState.connected = true;
    dbState.readyState = mongoose.connection.readyState;
    dbState.host = conn.connection.host;
    dbState.error = null;
    console.log(`MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    dbState.connected = false;
    dbState.readyState = mongoose.connection.readyState;
    dbState.error = error.message;
    console.error(`Database Connection Error: ${error.message}. Retrying in 5s...`);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;

