import User from "../model/user.model.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Token } from "types/token.js";
import "dotenv/config.js";
export async function login(req: Request, res: Response) {
	const { email, password, role } = req.body;
	console.log(email, password, role);
	try {
		const user = await User.findOne({
			email: email,
			password: password,
			role: role,
		});
		if (user) {
				const token = jwt.sign(
					{ _id: user._id, role: user.role },
					process.env.JWT_SECRET_KEY || "fail"
				);
			if (user.role == "admin") {
				res.cookie("adminaccesstoken", token, {
					httpOnly: true,
					secure: false,
				});
			} else {
				res.cookie("accesstoken", token, {
					httpOnly: true,
					secure: false,
				});
			}
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
			res.status(404).json({ success: false, message: "Error" });
		}
	} catch (e) {
		console.log(e);
	}
}

export async function register(req: Request, res: Response) {
	try {
		const { name, email, password, role } = req.body;
		if (role == "admin") {
			return res
				.status(400)
				.json({ success: false, message: "Admin cannot be registered" });
		}
		const existingUser = await User.findOne({ email: email, role: role });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "Email is already taken for " + role,
			});
		}
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
	const token = req.cookies?.accesstoken;
	if (!token)
		return res
			.status(200)
			.json({ success: false, message: "Token is not found" });
	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET_KEY || "fail"
		) as Token;
		if (payload.role == "admin") {
			return res
				.status(200)
				.json({ success: false, message: "admin cannot login from user page" });
		}
		const user = await User.findById(payload._id);
		if (user) {
			res.status(200).json({
				success: true,
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					role: payload.role,
				},
			});
		} else {
			res.status(200).json({ success: false });
		}
	} catch (e: any) {
		console.log(e);
	}
}
 
export const logout = (_req:Request,res:Response)=>{
	 res.clearCookie('accesstoken');
	 return res.status(200).json({success:true});
}