import jwt from "jsonwebtoken";
import { Token } from "types/token.js";
import { Request, Response } from "express";
import Class from "../model/class.model.js";
import User from "../model/user.model.js"

export const loginbytokenadmin = async(req:Request,res:Response)=>{
	const token = req.cookies.adminaccesstoken;
	if (!token){
		console.log(token);
		return res
		.status(200)
			.json({ success: false, message: "Token is not found" });
	}
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
	}
}

const getAllStudents = async () => {
	const allStudents = await User.find({ role: "student" });
	return allStudents;
};

const getAllTeachers = async () => {
	const allTeachers = await User.find({ role: "teacher" });
	return allTeachers;
};

export const search_student = async(req:Request,res:Response)=>{
	const query = req.query.prefix as string;
	const students = await User.find({email:{$regex:`^${query}`,$options:"i"},role:"student"}).limit(10);
	console.log(students)
	return res.status(200).json({success:true,students:students});
}
export const search_teacher = async(req:Request,res:Response)=>{
	const query = req.query.prefix as string;
	const teachers = await User.find({email:{$regex:`^${query}`,$options:"i"},role:"teacher"}).limit(10);
	return res.status(200).json({success:true,teachers:teachers});
}
interface groupDatatype{
	name:string,
	teacher_id:string,
	members:string[],
	last_message:any
}
export const createGroup = async(req: Request, res: Response) => {
	//search users using email and have the teacher also be searched using email but
	const groupData:groupDatatype = req.body;
	console.log("group creation");
	console.log(groupData);
	try{
		const res_class = await Class.create({name:groupData.name,teacher_id:groupData.teacher_id,members:groupData.members,last_message:null});
		if(res_class._id){
			return res.status(200).json({success:true});
		}
	}catch(e:any){
		console.log(e);
	}
};

export const editGroup = (req: Request, res: Response) => {};

export const deleteGroup = (req: Request, res: Response) => {};

export const getGroups = async (req: Request, res: Response) => {
	try {
		const groups = await Class.find({});
		return res.status(200).json({ success: true, data: groups });
	} catch (e) {
		console.log(e);
		return res
			.status(400)
			.json({ success: false, message: "groups were not found" });
	}
};
