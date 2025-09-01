
interface User{
    _id : string,  //This will be the id from database
    name : string,
    email : string,
    role : "teacher" | "student"|"",
    isAnonymous : boolean
}

export interface Messagetype{
    sender_name:string
    content : string
    sender_id : User["_id"] 
    status : "read" | "delivered" | "sent" 
    group_id : string
}