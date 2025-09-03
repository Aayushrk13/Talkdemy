import client from "../db/redis.js";
import { Request, Response } from "express";
export const getGroupMemberCache = (req:Request,res:Response,next:void)=>{
    //get values from redis and if not found got to database

}