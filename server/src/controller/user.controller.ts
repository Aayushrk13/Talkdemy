import {User} from "../model/user.model.js";
import {Request,Response} from "express";
export async function login(req: Request,res: Response){
    const {email,password} = req.body;
    const user = await User.findOne({email: email,password: password})
    if(user){
        console.log("user is found");
        res.status(200).json({success:true,user:this.user,accesstoken:"JWT token"})
    }
}
