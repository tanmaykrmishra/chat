import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json({ filteredUsers });
  } catch (err) {
    console.log("Error in getUsersForSidebar:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//getting the complete chat between me and other user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverID: userToChatId },
        { senderId: userToChatId, recieverID: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (err) {
    console.log("Error in getMessages controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverID } = req.params; //recieve the id as recieverID
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      recieverID,
      text,
      image: imageUrl,
    });
    await newMessage.save();

      //todo realtime functionality goes here => socket.io
      //here is the main deal

      const recieverSocketId = getRecieverSocketId(recieverID);
      if (recieverSocketId) {
          io.to(recieverSocketId).emit("newMessage", newMessage);
      }

    res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error in sendMessage controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
