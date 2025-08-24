import type { User } from "./User.js"
export interface Message{
    messageid : string | null,
    messagecontent : string
    User : User | null
}