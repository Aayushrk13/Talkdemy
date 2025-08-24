import { ObjectId, Schema,SchemaTypes,model} from "mongoose";

interface IClass extends Document{
    name:string,
    avatar:string,
    members:ObjectId[],
    teacher_id:ObjectId,
    messages:string //use message type when the messages are ready to be stored
}

const ClassSchema :Schema<IClass>= new Schema({
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    members:{
        type:[SchemaTypes.ObjectId],
        required:true
    },
    teacher_id:{
        type:SchemaTypes.ObjectId,
        required:true
    },
    messages:{
        type:String,
    },
},{
    timestamps:{createdAt:true,updatedAt:true}
})

const Class = model("Class", ClassSchema);

export{
    Class
}