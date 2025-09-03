
export type Usertype={
    _id : string,  //This will be the id from database
    name : string,
    email : string,
    role : "teacher" | "student"|"",
}

export type Messagetype={
    sender_name:string
    content : string
    sender_id : string
    status : "read" | "delivered" | "sent" 
    group_id : string
}