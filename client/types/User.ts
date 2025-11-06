export interface User{
    _id : string,  //This will be the id from database
    name : string,
    email : string,
    role : "teacher" | "student"|"admin"|"",
    isAnonymous : boolean
}

