import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { Class } from "../model/class.model";
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

