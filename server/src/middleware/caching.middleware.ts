import client from "../db/redis.js";
import { Group } from "types/Group.js";
import { Request, Response, NextFunction, raw } from "express";
export const getGroupMemberCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get values from redis and if not found got to database
  try {
    const current_group = req.body as Group;
    const members_data = await client.json.get(`members:${current_group._id}`);
    if (!members_data) {
      return next();
    }
    return res.status(200).json({ success: true, members_data: members_data });
  } catch (e) {
    console.log(e);
  }
};

export const getMessagesCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { group_id } = req.params;
    // const messages = await client.json.get(`messages:${group_id}`);
    const raw_messages = await client.lRange(`messages:${group_id}`,-10,-1)
    const messages = raw_messages.map(m=>JSON.parse(m));
    console.log(messages);
    if (messages.length == 0) return next();
    console.log("got message from redis");
    return res.status(200).json({ success: true, messages: messages });
  } catch (e) {
    console.log(e);
  }
};
