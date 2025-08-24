import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import {ObjectId} from "mongodb";
import { Class } from "../model/class.model";
import { Group } from "types/Group";//dont fix what is not broken
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
    socket.on("message", (message_data, classes_data) => {
      console.log("Class info:", classes_data);
      if(classes_data){//will be getting data of a specific class usign current class state
        console.log(classes_data.members);//this is like using broadcast without having to broadcast
        socket.to(classes_data.members[0]).emit("message",message_data);
      }
    });

    socket.on("joinrooms",(group_data)=>{
      joinrooms(group_data,socket);
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
      for (let index = 0; index < group.members.length; index++) {
        let temp = group.members[index].toString()
        temp = temp.replace(/\s+/g, "");
        console.log(temp);
        socket.join(temp);//find out if the id fo groups from the database stays the same
      }
    })
}


export { io };

