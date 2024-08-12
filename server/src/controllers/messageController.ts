import { Request, Response } from "express";
import conversationModel from "../database/models/conversationModel";
import messageModel from "../database/models/messageModel";
import { userModel } from "../database/models/userModel";
import mongoose from "mongoose";

const sendMessage = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { conversationId, receiverId, message, reference } = req.body;

  if (!message) {
    return res.status(400).json({ message: "No message provided" });
  }

  if (!conversationId && !receiverId) {
    return res.status(400).json({ message: "No ids provided" });
  }

  let queryParams: any;

  if (receiverId) {
    queryParams = {
      $and: [
        { participants: { $size: 2 } },
        { participants: { $all: [receiverId, userId] } },
      ],
    };
  } else if (conversationId) {
    queryParams = { _id: conversationId };
  }

  const newMessage = new messageModel({
    senderId: userId,
    message,
    seenBy: [userId],
  });

  if (reference) newMessage.reference = reference;

  try {
    const receiverExists = await userModel.findById(receiverId);

    if (!receiverExists && !conversationId) {
      return res.status(404).json({ message: "User not found" });
    }

    await newMessage.save();

    await newMessage.populate("senderId", "_id username");

    let conversation = await conversationModel.findOne(queryParams);

    if (!conversation && conversationId) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!conversation) {
      conversation = new conversationModel({
        participants: [userId, receiverId],
        messages: [newMessage._id],
        lastMessage: newMessage._id,
      });
    } else {
      conversation.messages.push(newMessage._id);
      conversation.lastMessage = newMessage._id;
    }

    await conversation?.save();
    await conversation?.populate("messages");

    if (conversation) {
      res.status(200).json(newMessage);
    } else {
      res.status(400).json({ message: "Failed to send message" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

const getConversationById = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { conversationId, receiverId } = req.body;

  if (!conversationId && !receiverId) {
    return res.status(400).json({ message: "No ids provided" });
  }

  let queryParams: any;

  if (receiverId) {
    queryParams = {
      $and: [
        { participants: { $size: 2 } },
        { participants: { $all: [receiverId, userId] } },
      ],
    };
  } else if (conversationId) {
    queryParams = { _id: conversationId };
  }

  try {
    let conversation: any;

    conversation = await conversationModel
      .findOne(queryParams)
      .populate("participants", "-password")
      .populate({
        path: "messages", // First-level population: populate the messages array
        populate: [
          {
            path: "senderId", // Nested population: populate the senderId field in each message
            select: "username", // Only select the username field from the user document
          },
          {
            path: "reference",
            select: "senderId message",
            populate: { path: "senderId", select: "username" },
          },
        ],
      })
      .exec();

    if (!conversation) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "Internal server error" });
  }
};

const getConversations = async (req: Request, res: Response) => {
  const { userId } = req.user;

  try {
    const conversations = await conversationModel
      .find({
        participants: { $in: [userId] },
      })
      .populate("participants", "username _id profileImageUrl coverImageUrl")
      .populate("messages", "message createdAt seenBy")
      .populate("lastMessage");

    if (conversations) {
      res.status(200).json(conversations);
    } else {
      res.status(404).json({ conversations: "No conversations found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "Internal server error" });
  }
};

const updateConversationSeenStatus = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { conversationId, receiverId } = req.body;

  if (!conversationId && !receiverId) {
    return res.status(400).json({ message: "No ids provided" });
  }

  let queryParams: any;

  if (receiverId) {
    queryParams = {
      $and: [
        { participants: { $size: 2 } },
        { participants: { $all: [receiverId, userId] } },
      ],
    };
  } else if (conversationId) {
    queryParams = { _id: conversationId };
  }

  try {
    let conversation: any;

    conversation = await conversationModel.findOne(queryParams);

    if (!conversation) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const getLastTenMessages = await messageModel
      .find({ _id: { $in: conversation.messages } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id");

    const extractId = getLastTenMessages.map((message) => message._id);

    await messageModel.updateMany(
      { _id: { $in: extractId } },
      {
        $addToSet: { seenBy: new mongoose.Types.ObjectId(userId as string) },
      }
    );

    res.status(200).json({ message: "Seen status updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "Internal server error" });
  }
};

export {
  sendMessage,
  getConversationById,
  getConversations,
  updateConversationSeenStatus,
};
