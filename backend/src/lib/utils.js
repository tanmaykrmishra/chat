import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true, // Ensures cookie is not accessible via JavaScript (for security) for XSS attacks
    secure: false, // Only send cookie over HTTPS in production
    maxAge: 3600000, // 1 hour in milliseconds
    sameSite: "strict",
  });
  return token;
};
