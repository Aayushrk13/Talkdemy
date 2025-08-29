import  User from "../model/user.model.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Token } from "types/token.js";
import "dotenv/config.js";
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET_KEY || "fail"
      );
      res.cookie("accesstoken", token, {
        httpOnly: true,
        secure: false,
      });
      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.json({ message: "Error" });
    }
  } catch (e) {
    console.log(e);
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    const existinguser = await User.findOne({ email: email });
    if (existinguser)
      return res
        .status(400)
        .json({ success: false, message: "Email is already taken" });
    //create a user instance and register it in DB and check if the email is valid using OAuth
    const user = new User({
      name: name,
      email: email,
      password: password,
      role: role,
    });
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (e: any) {
    console.log(e.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function loginByToken(req: Request, res: Response) {
  //for authentication and login without any
  const token = req.cookies?.accesstoken;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Token is not found" });
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "fail"
    ) as Token;
    const user = await User.findById(payload._id);
    if (user) {
      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (e: any) {
    console.log(e);
    res.status(401).json({ success: false });
  }
}
