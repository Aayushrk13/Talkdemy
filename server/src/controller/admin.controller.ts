import jwt from "jsonwebtoken";
import { Token } from "types/token.js";
import { Request, Response } from "express";
import Class from "../model/class.model.js";
import User from "../model/user.model.js"
import { Group } from "types/Group.js";
import Message from "../model/message.model.js";
import { Types } from "mongoose";
import GroupInvite from "../model/groupinvite.model.js";

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

export const getAllMembersofGroup = async (req:Request,res:Response) => {
	const members_id = req.body;
	console.log(members_id)
	const allmembersofGroup = await User.find({_id:members_id });
	return res.status(200).json({success:true,allMembersofGroup:allmembersofGroup});
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
	creator_id:string,
	name:string,
	teacher_id:string,
	members:string[],
	last_message:any
}
// export const createGroup = async(req: Request, res: Response) => {
// 	//search users using email and have the teacher also be searched using email but
// 	const groupData:groupDatatype = req.body;
// 	console.log("group creation");
// 	console.log(groupData);
// 	try{
// 		const res_class = await Class.create({name:groupData.name,teacher_id:groupData.teacher_id,members:groupData.members,last_message:null});
// 		if(res_class._id){
// 			return res.status(200).json({success:true});
// 		}
// 	}catch(e:any){
// 		console.log(e);
// 	}
// };

const inviteToGroup = async(groupData:groupDatatype,group_id:Types.ObjectId)=>{
	const currentGroup = await Class.findOne({_id:group_id});
	if(groupData.members.length > 0){
		for(const id of groupData.members){
			const userId = new Types.ObjectId(id)	
			const userExists = await User.findById(userId);
			if(!userExists) continue;
			if(currentGroup?.members.includes(userId)){
				return;
			}

			await GroupInvite.create({
				group_name:groupData.name,
				invitedUserId:userId,
				status:"pending",
				invitedByUserId:groupData.creator_id
			});	
		}
	}
	if(!currentGroup){
		//group not found	
		return;
	}
}

export const createGroup = async (req: Request, res: Response) => {
  try {
	const groupData:groupDatatype = req.body;

    const group = await Class.create({
      name:groupData.name,
      teacher_id:groupData.teacher_id,
      last_message: null
    });

	inviteToGroup(groupData,group._id)
    return res.status(201).json({
      success: true,
      groupId: group._id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

export const editGroup = async(req: Request, res: Response) => {
	const grouptobeupdated : Group = req.body;
	console.log(grouptobeupdated)
	const updatedgroup = await Class.updateOne({_id:grouptobeupdated._id},{$set:{
		name:grouptobeupdated.name,
		members:grouptobeupdated.members,
		teacher_id:grouptobeupdated.teacher_id,
		last_message:null,
	}});
	console.log(updatedgroup)
	if(updatedgroup){
		return res.status(200).json({success:true});
	}
	return res.status(200).json({success:false});
};

export const deleteGroup = async(req: Request, res: Response) => {
	const grouptobeDeleteId = req.query.grouptobeDeleteId as string;
	console.log(grouptobeDeleteId);
	const deleted = await Class.deleteOne({_id:grouptobeDeleteId});
	await Message.deleteMany({group_id:grouptobeDeleteId});
	console.log(deleted)
	if(deleted){
		return res.status(200).json({success:true});
	}
	return res.status(200).json({success:false});
};

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

export const getmessagesAdmin = async(req:Request,res:Response)=>{
	const group_id = req.query.groupId as string;
	try{
		const messages = await Message.find({group_id:group_id});
		if(messages.length>0){
			return res.status(200).json({success:true,messages:messages});
		}
			return res.status(200).json({success:true,messages:[]});
	}catch(e:any){
		console.log(e);
	}
}

export const getUser = async(req:Request,res:Response)=>{
	const user_id = req.query.user_id as string;
	const user = await User.findOne({_id:user_id});
	if(user){
		return res.status(200).json({success:true,user_name:user.name});
	}
		return res.status(200).json({success:false});
}