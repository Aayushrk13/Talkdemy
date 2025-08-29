import type { User } from "./User.js"
export interface Message{
    content : string
    sender_id : User["_id"] 
    sender_name : User["name"]
    status : "read" | "delivered" | "sent" 
    group_id : string
}