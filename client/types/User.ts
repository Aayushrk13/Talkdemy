export type User = {
    user_id : string,  //This will be the id from database
    name : string,
    email : string,
    role : "teacher" | "student",
}

