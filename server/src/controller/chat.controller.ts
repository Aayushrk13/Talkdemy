import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import type { Messagetype, Usertype } from "types/Message";
import Class from "../model/class.model";
import User from "../model/user.model";
import Message from "../model/message.model";
import client from "../db/redis.js";
import type { Group } from "types/Group";

export async function getclasses(req: Request, res: Response) {
  try {
    const user_id = req.params.user_id as string;
    const id = new ObjectId(user_id);
    const classes_data = await Class.find({ members: id });
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
//wont be used to handle message request instead use as a next function for messages
export async function handle_message(message_obj: Messagetype) {
  console.log("hit");
  try {
    const message = new Message({
      group_id: new ObjectId(message_obj.group_id),
      content: message_obj.content,
      status: message_obj.status,
      sender_id: new ObjectId(message_obj.sender_id),
      sender_name: message_obj.sender_name,
    });
    await message.save();
    await client.rPush(`messages:${message_obj.group_id}`,JSON.stringify(message_obj));
  } catch (e) {
    console.log(e);
  }
}

export async function get_messages(req: Request, res: Response) {
  const { group_id, page } = req.params;
  if (group_id == '') return res.status(404).send("No group id")
  const pageSize = 10;
  const skipSize = (Number(page)+1) * pageSize - pageSize;
  const id = new ObjectId(group_id);
  try {
    const messages = await Message.find({ group_id: id })
      .sort({ createdAt: 1 })
      .lean<Messagetype[]>()
      .skip(skipSize);
    console.log(messages);
    const serialized = messages.map((m) => JSON.stringify(m));
    console.log("from db",serialized);
    // await client.rPush(`messages:${group_id}`,serialized);
    if (!serialized || serialized.length == 0){
      console.log("empty serialized",serialized);
      return res.status(200).json({success: true, messages: []})
    }
    await client.rPush(`messages:${group_id}`, serialized);
    return res.status(200).json({ success: true, messages: messages });
  } catch (e) {
    console.log(e);
    return res.status(500).json({success:false,messages:[]})
  }
}
