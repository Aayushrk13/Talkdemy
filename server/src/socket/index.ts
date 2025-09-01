import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import {ObjectId} from "mongodb";
import  Class  from "../model/class.model";
import { Group } from "types/Group";//dont fix what is not broken
import { Messagetype } from "types/Message";
import { handle_message } from "../controller/chat.controller";
let io;

export function initSocket(server: HttpServer) {
    io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    // Handle incoming messages
    socket.on("message", (message_data:Messagetype) => {
      handle_message(message_data);
      socket.to(message_data.group_id).emit("message",message_data);
    });

    socket.on("joinrooms",(user_id)=>{
      joinrooms(user_id,socket);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

const joinrooms = async(user_id : string ,socket:Socket)=>{
    const id = new ObjectId(user_id);
    const group_data = await Class.find({members:id}) as Group[];
    group_data.map((group)=>{
      socket.join(group._id.toString());
    })
}



