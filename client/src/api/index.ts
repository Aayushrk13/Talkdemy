import axios from "axios";

interface Signup{
    name:string,
    email:string,
    password:string,
    role:"student" | "teacher" | ""
}

const apiObj = axios.create({
    baseURL : "http://localhost:8000",
    withCredentials:true,
    timeout : 10000
})

const loginUser = (data : {email:string;password:string})=>{
    return apiObj.post("user/login",data);
}

const registerUser = (data:Signup)=>{
    return apiObj.post("user/register",data);
}

const logoutUser=()=>{
    return apiObj.get("user/logout");
}

const loginUserByToken=()=>{
    return apiObj.get("user/auth");
}

const getclasses=(id:string)=>{
    return apiObj.get(`chat/classes/${id}`);
}

export{
    loginUser,
    registerUser,
    logoutUser,
    loginUserByToken,
    getclasses
}