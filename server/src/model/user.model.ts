import {Schema, model} from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  createdAt: Date;
}

const Userschema :Schema<IUser> = new Schema({
    name:{
        type:String,
        required :true,
    },
    email:{
        type:String,
        required :true,
    },
    password:{
        type:String,
        required :true,
    },
    role:{
        type:String,
        required:true,
        enum:["teacher","student"]
    }
},{timestamps:{createdAt:true,updatedAt:false}})

const User = model("user",Userschema)

export default User;