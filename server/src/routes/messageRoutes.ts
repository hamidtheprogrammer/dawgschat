import { Router } from "express";
import {
  getConversations,
  getConversationById,
  sendMessage,
  updateConversationSeenStatus,
} from "../controllers/messageController";
import { authenticate } from "../middlewares/verifyToken";

const messageRouter = Router();

messageRouter.route("/send-message").post(authenticate, sendMessage);
messageRouter
  .route("/get-current-conversation")
  .post(authenticate, getConversationById);
messageRouter.route("/get-conversations").get(authenticate, getConversations);
messageRouter
  .route("/update-conversation-seen-status")
  .post(authenticate, updateConversationSeenStatus);

export default messageRouter;
