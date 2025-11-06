import {Request,Response} from "express"
import jwt from "jsonwebtoken";
import { Token } from "types/token";

//uses the payload on JWT token to authorize each admin req
export const adminauthMiddleware = (req:Request,res:Response,next:Function)=>{
  const token = req.cookies?.accesstoken as string;
  const payload = jwt.verify(token,process.env.JWT_SECRET_KEY || "fail") as Token
  if(payload.role == "admin") next();
  return res.status(501).json({success:false,message:"User is not an authorized admin"});
}
