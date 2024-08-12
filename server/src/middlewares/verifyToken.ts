import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { userModel } from "../database/models/userModel";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = process.env.SECRET_KEY as string;
  let token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    token = jwt.verify(token, secret) as string;
    const decoded = await userModel.findById(token.userId).select("-password");
    if (!decoded) return res.status(401).json({ messaeg: "Not authroized" });
    req.user = { username: decoded.username, userId: decoded._id.toString() };
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

const verifyToken = async (req: Request, res: Response) => {
  const secret = process.env.SECRET_KEY as string;
  let token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    token = jwt.verify(token, secret);
    const decoded = await userModel.findById(token.userId).select("-password");
    if (!decoded) return res.status(401).json({ message: "Not authorized" });
    const user = { username: decoded.username, _id: decoded._id.toString() };
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

export { authenticate, verifyToken };
