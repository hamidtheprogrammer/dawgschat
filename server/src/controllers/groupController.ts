import { Request, Response } from "express";
import conversationModel from "../database/models/conversationModel";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

const createGroup = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { members, name } = req.body;

  const splitMembers = members
    .toString()
    .split("_")
    .map((id: string) => new mongoose.Types.ObjectId(id));

  if (!members.length) {
    return res.status(400).json({ message: "No members provided" });
  }

  try {
    const createGroup = new conversationModel({
      participants: [...splitMembers, userId],
      isGroup: true,
      admins: [new mongoose.Types.ObjectId(userId)],
    });

    if (createGroup) {
      name
        ? (createGroup.groupName = name)
        : (createGroup.groupName = "Group" + createGroup._id);
      await createGroup.save();
      res.status(200).json(createGroup);
    } else {
      res.status(400).json({ message: "Failed to create group" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "Internal server error" });
  }
};

const addMember = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { members, conversationId } = req.body;

  const splitMembers = members.toString().split("_");

  if (!members.length || members.length < 0) {
    return res.status(400).json({ message: "Members not provided" });
  }
  try {
    const getGroup = await conversationModel.findById(conversationId);

    if (!getGroup || !getGroup.isGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!getGroup.admins.includes(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    splitMembers.forEach((member: string) =>
      getGroup.participants.push(new mongoose.Types.ObjectId(member))
    );

    await getGroup.save();
    const updatedGroup = await getGroup.populate("participants");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editGroup = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { groupData } = req.body;
  const files = req.files as { [fieldName: string]: Express.Multer.File[] };

  try {
    const getGroup = await conversationModel.findById(groupData._id);

    if (!getGroup || !getGroup.isGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!getGroup.admins.includes(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (files.profileImage) {
      const uploadImage = files.profileImage[0];
      const b64 = Buffer.from(uploadImage.buffer).toString();
      const uri = "data:" + uploadImage.mimetype + ";base64," + b64;
      groupData.profileImage = (await cloudinary.v2.uploader.upload(uri)).url;
    }

    if (files.coverImage) {
      const uploadImage = files.coverImage[0];
      const b64 = Buffer.from(uploadImage.buffer).toString("base64");
      const uri = "data:" + uploadImage.mimetype + ";base64," + b64;
      groupData.coverImage = (await cloudinary.v2.uploader.upload(uri)).url;
    }

    const updatedGroup = await conversationModel.findByIdAndUpdate(
      groupData._id,
      groupData
    );

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const kickMember = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { member, conversationId } = req.body;

  if (!member) {
    return res.status(400).json({ message: "Member not provided" });
  }
  try {
    const getGroup = await conversationModel.findById(conversationId);

    if (!getGroup || !getGroup.isGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!getGroup.admins.includes(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const updatedGroup = await conversationModel.findByIdAndUpdate(
      conversationId,
      { $pull: { participants: member } }
    );

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addMember, kickMember, createGroup, editGroup };
