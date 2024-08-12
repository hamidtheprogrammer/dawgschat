import { Schema, model, Model } from "mongoose";

export type userTypes = {
  username: string;
  email: string;
  password: string;
  profileImageUrl: string;
  coverImageUrl: string;
};

const userSchema: Schema<userTypes> = new Schema(
  {
    username: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String },
    coverImageUrl: { type: String },
  },
  { timestamps: true }
);

const userModel: Model<userTypes> = model<userTypes>("users", userSchema);

export { userModel };
