import { Schema, Model, model } from "mongoose";

export interface IConversation {
  participants: any[];
  messages: any[];
  isGroup: boolean;
  groupName: string;
  admins: any[];
  lastMessage: any;
  profileImageUrl: string;
  coverImageUrl: string;
}

const conversationSchema: Schema<IConversation> = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "users", required: true },
    ],
    messages: [
      { type: Schema.Types.ObjectId, ref: "messages", required: true },
    ],
    isGroup: { type: Boolean, required: true, default: false },
    groupName: {
      type: String,
    },
    profileImageUrl: { type: String },
    coverImageUrl: { type: String },
    admins: [{ type: Schema.Types.ObjectId, ref: "users", required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "messages" },
  },
  { timestamps: true }
);

const conversationModel: Model<IConversation> = model<IConversation>(
  "conversations",
  conversationSchema
);

export default conversationModel;
