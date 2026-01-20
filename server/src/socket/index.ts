import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { ObjectId } from "mongodb";
import Class from "../model/class.model";
import GroupInvite from "../model/groupinvite.model";
import { Messagetype } from "types/Message";
import { handle_message } from "../controller/chat.controller";
let io;

export function initSocket(server: HttpServer) {
	io = new Server(server, {
		cors: {
			origin: "http://localhost:5173",
			credentials: true,
		},
		maxHttpBufferSize: 100 * 1024 * 1024,
	});

	io.on("connection", (socket) => {

		socket.on("message", async (message_data: Messagetype) => {
			await handle_message(message_data);
			socket.to(message_data.group_id).emit("message", message_data);
		});

		socket.on("joinrooms", (user_id: string) => {
			joinrooms(user_id, socket);
		});

		socket.on("invite:accepted", async (inviteId: string) => {
			const groupInvite = await GroupInvite.findById(inviteId);
			if (!groupInvite) return;

			const chat = await Class.findById(groupInvite.groupId);
			if (!chat) return;
			const members = [
				...chat.members.map((m) => m.toString()),
				groupInvite.invitedUserId.toString(),
			];

			// enforce DM rules
			const uniqueSortedMembers = Array.from(new Set(members)).sort((a, b) =>
				a.localeCompare(b)
			);

			console.log("sortedmemberIds",uniqueSortedMembers);
			await Class.updateOne(
				{ _id: chat._id },
				{
					$set: {
						members: uniqueSortedMembers,
					},
				}
			);

			await GroupInvite.findByIdAndDelete(inviteId);
			socket.emit("invite:accepted:acknowledge", chat._id);
		});

		socket.on("invite:rejected", async (inviteId: string) => {
			await GroupInvite.findByIdAndDelete(inviteId);
			console.log("rejected");
		});

		socket.on("typing:start", ({ chatId, userId, username }) => {
			socket.to(chatId).emit("typing:start", { userId, username });
		});

		socket.on("typing:stop", ({ chatId, userId }) => {
			socket.to(chatId).emit("typing:stop", { userId });
		});

		//use the same group for direct chat
		socket.on("createDirectChat", async ({ creatorId, receiverId }) => {
			try {
				const creatorInvites = await GroupInvite.find({
					invitedByUserId: creatorId,
					invitedUserId: receiverId,
				});
				console.log("creator invite",creatorInvites);
				const receiverInvites = await GroupInvite.find({
					invitedByUserId:receiverId ,
					invitedUserId:creatorId ,
				});
				console.log("receiver invite",receiverInvites);
 
				if(creatorInvites.length>0){
					socket.emit("createdirectchat:fail:invitealreadysent");
					return;
				}else if(receiverInvites.length>0){
					socket.emit("createdirectchat:fail:invitealreadyreceived");
                    return;
				}
				const groupExists = await Class.findOne({
					type: "direct",
					members: { $all: [creatorId, receiverId] },
				});
				if(groupExists){
					socket.emit("createdirectchat:fail:chatexists",{groupExists});
					return;
				}
				console.log("newgroupiscretead")
				const directMessageGroup = await Class.create({
					type: "direct",
					members: [creatorId],
				});
				inviteToDirectMessaging(creatorId, receiverId, directMessageGroup._id);
				console.log("dm",directMessageGroup);
				socket.emit("createdirectchat:success:groupcreated",{directMessageGroup});
			} catch (e) {
				console.log(e);
			}
		});
		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);
		});
	});
	return io;
}

const inviteToDirectMessaging = async (
	creatorId: string,
	receiverId: string,
	groupId: ObjectId
) => {
	await GroupInvite.create({
		group_name: "Direct Message",
		groupId: groupId,
		invitedUserId: receiverId,
		invitedByUserId: creatorId,
		status: "pending",
	});
};

const joinrooms = async (user_id: string, socket: Socket) => {
	if (user_id == "admin") {
		const group_data = await Class.find({});
		group_data.map((group) => {
			socket.join(group._id.toString());
		});
		return;
	}

	const id = new ObjectId(user_id);

	const group_data = await Class.find({
		$or: [
			{ members: id }, // if user's id is inside the members array
			{ teacher_id: id }, // or if user is the teacher
		],
	});

	group_data.map((group) => {
		socket.join(group._id.toString());
	});
};
