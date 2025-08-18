import {User} from "../model/user.model.js";
import {Request,Response} from "express";
import jwt from "jsonwebtoken"; 
import {Token} from  '../types/token.js'
import "dotenv/config.js"
export async function checkauth(req:Request,res:Response){
    const token = req.cookies?.accesstoken;
    const payload = jwt.verify(token,process.env.JWT_SECRET_KEY||"fail") as Token; 
    const id = payload._id;
    const user = await User.findById(payload._id)
    res.status(200).json({success:true,user:user});
}