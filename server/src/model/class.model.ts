import { Schema,SchemaTypes,Types,model} from "mongoose";

const ClassSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    members:{
        type:[SchemaTypes.ObjectId],
        ref : "User",
        required:true
    },
    teacher_id:{
        type:SchemaTypes.ObjectId,
        required:true
    },
    last_message:{
        content : String,
        sender_id: {type : SchemaTypes.ObjectId, ref: "User"},
        timestamp : Date
    },
},{
    timestamps:{createdAt:true,updatedAt:true}
})

const Class = model("Class", ClassSchema);

export default Class;