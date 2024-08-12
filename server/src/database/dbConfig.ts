import mongoose from "mongoose";
import cloudinary from "cloudinary";

const connectDb = async () => {
  let connected: boolean = false;
  try {
    if (connected) {
      return;
    }
    await mongoose.connect(process.env.DATABASE_URL as string, {
      dbName: "dawgschat",
    });

    connected = true;
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;

export const connectCloudinary = async () => {
  cloudinary.v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_API_NAME,
  });
};
