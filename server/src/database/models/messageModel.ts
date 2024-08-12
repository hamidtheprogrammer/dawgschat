import { Schema, Model, model } from "mongoose";

export interface IMessage {
  senderId: Schema.Types.ObjectId | string;
  message: string;
  seenBy: Schema.Types.ObjectId[];
  reference: Schema.Types.ObjectId;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    message: { type: String, required: true },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "users", required: true }],
    reference: { type: Schema.Types.ObjectId, ref: "messages" },
  },
  { timestamps: true }
);

const messageModel: Model<IMessage> = model<IMessage>(
  "messages",
  messageSchema
);

export default messageModel;
