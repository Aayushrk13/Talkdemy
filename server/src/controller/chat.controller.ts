import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import type { Messagetype } from "types/Message";
import Class from "../model/class.model";
import User from "../model/user.model";
import Message from "../model/message.model";

export async function getclasses(req:Request,res:Response) {
    try{
        const user_id = req.params.user_id as string; 
        const id = new ObjectId(user_id);
        const classes_data = await Class.find({members:id});
        return res.status(200).json({success:true,data:classes_data});
    }catch(e:any){
        console.log(e.message);
        res.status(400).json({success:false,message:e.message});
    }
}

export async function getmembers(req:Request,res:Response){
   try{
    const members_id = req.body as string[];
    members_id.map((id)=>{
        return new ObjectId(id);
    })
    const members_data = await User.find({_id:members_id});
    return res.status(200).json({success:true,members_data:members_data});
   }catch(e){
    console.log(e);
    return res.status(400).json({success:false,message:e});
   } 
}
//wont be used to handle message request instead use as a next function for messages
export async function handle_message(req:Request,res:Response){
    const message_obj = req.body as Messagetype;
    console.log("hit");
    try{
        const message = new Message({
            group_id : new ObjectId(message_obj.group_id),
            content : message_obj.content,
            status : message_obj.status,
            sender_id : new ObjectId(message_obj.sender_id),
        });
        await message.save();
        return res.status(200);
    }catch(e){
        console.log(e);
        return res.status(401).json({message:"Something went wrong while entering message to the data base"})
    }
}