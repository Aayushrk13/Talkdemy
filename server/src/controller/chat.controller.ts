import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import type { Messagetype, Usertype } from "types/Message";
import Class from "../model/class.model";
import User from "../model/user.model";
import Message from "../model/message.model";
import client from "../db/redis.js";
import type { Group } from "types/Group";
import { io } from "../index";
import GroupInvite from "../model/groupinvite.model";

export async function uploadfile(req: Request, res: Response) {
	if (!req.file) return res.status(400).send("No file uploaded");
	const data = req.body;
	const message = new Message({
		group_id: data.group_id,
		content: "",
		status: "sent",
		sender_id: data.user_id,
		sender_name: data.sender_name,
		fileURL: `${req.protocol}://${req.get("host")}/uploads/${
			req.file.filename
		}`,
	});
	try {
		await message.save();
		await client.rPush(
			`messages:${data.group_id}`,
			JSON.stringify({
				sender_id: data.user_id,
				sender_name: data.sender_name,
				content: "",
				group_id: data.group_id,
				fileURL: `${req.protocol}://${req.get("host")}/uploads/${
					req.file.filename
				}`,
				status: "sent",
			})
		);
	} catch (e) {
		console.log(e);
	}
	io.to(req.body.group_id).emit("file-uploaded", {
		fileURL: `${req.protocol}://${req.get("host")}/uploads/${
			req.file.filename
		}`,
		content: " ",
		sender_id: data.user_id,
		sender_name: data.sender_name,
		group_id: data.group_id,
		status: "sent",
	});
	return res.status(200).json({ success: true });
}

export async function getinvites(req: Request, res: Response) {
	const user_id = req.query.id as string;
	const invites = await GroupInvite.find({ invitedUserId: user_id });
	return res.status(200).json({ success: true, data: invites });
}

export async function getclasses(req: Request, res: Response) {
	try {
		const user_id = req.query.id as string;
		const classes_data = await Class.find({ members: user_id });
		const c_Data = await Class.find({ teacher_id: user_id });
		if (c_Data.length > 0) {
			c_Data.forEach((element) => {
				classes_data.push(element);
			});
		}
		return res.status(200).json({ success: true, data: classes_data });
	} catch (e: any) {
		console.log(e.message);
		res.status(400).json({ success: false, message: e.message });
	}
}

export async function getmembers(req: Request, res: Response) {
	try {
		const current_group = req.body as Group;
		const members_id = current_group.members;
		const members_data = await User.find({ _id: members_id }).lean<
			Usertype[]
		>();
		client.json.set(`members:${current_group._id}`, "$", members_data);
		return res.status(200).json({ success: true, members_data: members_data });
	} catch (e) {
		console.log(e);
		return res.status(400).json({ success: false, message: e });
	}
}

export async function handle_message(message_obj: Messagetype) {
	try {
		const message = new Message({
			group_id: new ObjectId(message_obj.group_id),
			content: message_obj.content,
			status: message_obj.status,
			sender_id: new ObjectId(message_obj.sender_id),
			sender_name: message_obj.sender_name,
			fileURL: null,
		});
		await message.save();
		await client.rPush(
			`messages:${message_obj.group_id}`,
			JSON.stringify(message_obj)
		);
	} catch (e) {
		console.log(e);
	}
}

export async function get_messages(req: Request, res: Response) {
	const { group_id, page } = req.params;
	if (group_id == "") return res.status(404).send("No group id");
	const pageSize = 10;
	const skipSize = Number(page) * pageSize - pageSize;
	const id = new ObjectId(group_id);
	try {
		const messages = await Message.find({ group_id: id })
			.sort({ createdAt: 1 })
			.lean<Messagetype[]>()
			.skip(skipSize);
		const serialized = messages.map((m) => JSON.stringify(m));
		if (!serialized || serialized.length == 0) {
			return res.status(200).json({ success: true, messages: [] });
		}
		await client.rPush(`messages:${group_id}`, serialized);
		return res.status(200).json({ success: true, messages: messages });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ success: false, messages: [] });
	}
}

export async function checktoxicity(req: Request, res: Response) {
	const { message } = req.body;
	console.log(message);
	const toxicity_response = await fetch(
		`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.SECRET_API_KEY}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				comment: { text: message },
				requestedAttributes: { TOXICITY: {} },
			}),
		}
	);

	const data = await toxicity_response.json();
	console.log(data);
	return res.status(200).json({
		success: true,
		toxicity_score: data.attributeScores.TOXICITY.spanScores,
	});
}

export async function getTeacher(req: Request, res: Response) {
	const teacher_id = req.query.teacher_id as string;
	const teacher = await User.findById(teacher_id);
	console.log(teacher);
	if (teacher) {
		return res.status(200).json({ success: true, teacher: teacher });
	}
}

export async function getGroupInvites(req: Request, res: Response) {
	const userId = req.query.user_id as string;
	console.log(userId);
	try {
		const groupInvites = await GroupInvite.find({ invitedUserId: userId });
		console.log(groupInvites);
		return res.status(200).json({ success: true, groupinvites: groupInvites }); //Send group invites to the frontend after searching for them even if it is empty
	} catch (e) {
		console.log(e);
	}
	return res.status(400).json({ success: false, message: "Unknown error" });
}

export const getUser = async (req: Request, res: Response) => {
	const user_id = req.query.user_id as string;
	const user = await User.findOne({ _id: user_id });
	if (user) {
		return res.status(200).json({ success: true, user_name: user.name });
	}
	return res.status(200).json({ success: false });
};

export const handle_groupinvite = async (req: Request, res: Response) => {
	//inviteId is the id of the invite request not the group
	const { response,inviteId } = req.body;
	if (response) {
		//handle accepted
		const groupInvite = await GroupInvite.findById(inviteId);	
		console.log(groupInvite);
		if(!groupInvite) return;
		await Class.updateOne({_id:groupInvite.groupId},{$addToSet:{
			members: groupInvite.invitedUserId
		}});
		await GroupInvite.findByIdAndDelete(inviteId);
		console.log("accepted");
	} else {
		//handle rejected
		await GroupInvite.findByIdAndDelete(inviteId);
		console.log("rejected");
	}
	return res.end("end")
};
