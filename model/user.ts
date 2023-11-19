import mongoose, { Schema, Model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { UserDocument } from "../interfaces/userInterface";

const userSchema: Schema<UserDocument> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String },
});

userSchema.plugin(uniqueValidator);

const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema
);

export default User;
