
interface User{
    _id : string,  //This will be the id from database
    name : string,
    email : string,
    role : "teacher" | "student"|"",
    isAnonymous : boolean
}


export interface Message{
    messageid : string | null,
    messagecontent : string
    User : User | null
}
