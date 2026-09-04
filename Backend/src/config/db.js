import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = 'mongodb+srv://vinijinodiya_db_user:VmYjntYswrjgFN9F@clustershippnex.3wcv3xd.mongodb.net/?appName=Clustershippnex';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
  }
};

export default connectDB;

