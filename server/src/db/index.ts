import mongoose from "mongoose";
import 'dotenv/config.js';

export const connectDB = async () => {
  try { 
    const connectionInstance = await mongoose.connect(process.env.DB_CONNECTION||"FAIL"); 
    console.log("GREAT SUCCESS");
  } catch (error) { 
    console.log("Something went wrong while connecting MONGODB");
    process.exit(1);
  }
} 