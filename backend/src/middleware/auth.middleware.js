import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
      const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized no token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized no token provided" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // we are finding the user by the id that we got by decoding jwt and then we are adding the user field in req. So now req.user will get us all details of the user like req.user.email.
    next();
  } catch (err) {
      console.log("Error in protectRoute middleware:", err.message);
      res.status(500).json({ message: "Internal server error" });
  }
};
