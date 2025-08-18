import {User} from "../model/user.model.js";
import {Request,Response} from "express";
import jwt from "jsonwebtoken"; 
import "dotenv/config.js"
export async function login(req: Request,res: Response){
    console.log(req);
    console.log(req.body);
    const {email,password} = req.body;
    const user = await User.findOne({email: email,password: password})
    if(user){
        const token = jwt.sign({"_id":user._id},process.env.JWT_SECRET_KEY||"fail");
        res.cookie("accesstoken",token,{
            httpOnly:true,
            secure:false
        });
        res.status(200).json({success:true,user:{
            "_id":user._id,
            "name":user.name,
            "email":user.email,
            "role":user.role
        },accesstoken:token})
    }else{
        res.json({message:"Error"});
    }
}

export async function signup(req: Request,res: Response){
    const {name,email,password,role} = req.body;
    //create a user instance and register it in DB and check if the email is valid using OAuth
}