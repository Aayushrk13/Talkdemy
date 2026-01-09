import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { ObjectId } from "mongodb";
import Class from "../model/class.model";
import User from "../model/user.model";
import { Group } from "types/Group"; //dont fix what is not broken
import { Messagetype } from "types/Message";
import { handle_message } from "../controller/chat.controller";
import path from "path";
import fs from "fs";
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
		console.log("User connected:", socket.id);

		socket.on("message", async (message_data: Messagetype) => {
			await handle_message(message_data);
			console.log(message_data);
			socket.to(message_data.group_id).emit("message", message_data);
		});

		socket.on("joinrooms", (user_id: string) => {
			joinrooms(user_id, socket);
		});

		socket.on("typing:start", ({ chatId, userId,username }) => {
			console.log(username)
			socket.to(chatId).emit("typing:start", { userId,username });
		});

		socket.on("typing:stop", ({ chatId, userId }) => {
			socket.to(chatId).emit("typing:stop", { userId });
		});

		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);
		});
	});
	return io;
}

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
