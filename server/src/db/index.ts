import mongoose from "mongoose";


export const connectDB = async () => {
  try { 
    const connectionInstance = await mongoose.connect("mongodb://127.0.0.1:27017/Talkdemy") 
  } catch (error) { 
    console.log("Something went wrong while connecting MONGODB");
    process.exit(1);
  }
} 