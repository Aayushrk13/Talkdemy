import {model, ObjectId, Schema, SchemaTypes} from "mongoose";

interface IMessage extends Document {
    group_id: ObjectId,
    sender_id : ObjectId,
    content : String,
    status : 'read' | 'delivered' | 'sent'
}

const MessageSchema : Schema<IMessage> = new Schema({
    group_id : {
        type : Schema.Types.ObjectId,
        ref : "Class"
    },
    sender_id:{
        type :Schema.Types.ObjectId,
        ref : "User"
    },
    content : {
        type : "String",
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : ["read","delivered","sent"]
    }
},{
    timestamps:{createdAt:true,updatedAt:true}
})

const Message = model ("Message",MessageSchema);

export default Message;