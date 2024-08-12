import { Request, Response } from "express";
import { userModel } from "../database/models/userModel";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import cloudinary from "cloudinary";

const registerUser = async (req: Request, res: Response) => {
  const userData = req.body;

  try {
    const emailExists = await userModel.findOne({ email: userData.email });
    if (emailExists) {
      return res.status(400).json({ email: "Email already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(userData.password, salt);
    userData.password = hashedPassword;

    const newUser = new userModel(userData);

    if (newUser) {
      if (!newUser.username) {
        newUser.username = `user${newUser._id}`;
      }
      await newUser.save();
      generateToken(newUser._id.toString(), res);
      res.status(200).send(newUser);
    } else {
      res
        .status(400)
        .json({ message: "Failed to create user, please try again" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ email: "Email does not exist" });

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({ password: "Invalid password" });

    generateToken(user._id.toString(), res);
    res.status(200).json({ _id: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
    console.log(error);
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  const userData = req.body;
  const { userId } = req.user;
  const files = req.files as { [fieldName: string]: Express.Multer.File[] };

  if (userData.password) {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(userData.password, salt);
    userData.password = hashedPassword;
  }

  try {
    if (files.profileImage && files.profileImage[0]) {
      const profileImage = files.profileImage[0];
      const b64 = Buffer.from(profileImage.buffer).toString("base64");
      const uri = "data:" + profileImage.mimetype + ";base64," + b64;
      const res = await cloudinary.v2.uploader.upload(uri);
      userData.profileImageUrl = res.url;
      console.log(res.url);
    }
    if (files.coverImage && files.coverImage[0]) {
      const coverImage = files.coverImage[0];
      const b64 = Buffer.from(coverImage.buffer).toString("base64");
      const uri = "data:" + coverImage.mimetype + ";base64," + b64;
      const res = await cloudinary.v2.uploader.upload(uri);
      userData.coverImageUrl = res.url;
    }

    const updatedProfile = new userModel(userData);

    console.log(updatedProfile);

    await userModel.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    if (!updatedProfile)
      return res.status(400).json({ message: "Failed to update user" });
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
    console.log(error);
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.user;
  try {
    const user = await userModel.findById(userId).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
    console.log(error);
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", {
      maxAge: Date.now(),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "development",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
    console.log(error);
  }
};

const getUsers = async (req: Request, res: Response) => {
  const { userId } = req.user;
  try {
    const users = await userModel
      .find({ _id: { $ne: userId } })
      .select("-password");
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  getUsers,
  getUserProfile,
};
