import mongoose from 'mongoose';
import env from 'dotenv';

env.config();

const connectDB = async () => {
    try {
      console.log('entred db utils')
      const connect = await mongoose.connect(process.env.MONGO_URI as string);
      console.log("Database connected successfully...");
    } catch (error) {
      console.log("Database connection failed", error);
    }
  }

export default connectDB;

