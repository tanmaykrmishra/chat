import mongoose from "mongoose";
import User from "../models/user.model.js";  // Import the User model

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
