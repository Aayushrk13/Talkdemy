import axios from "axios";
import type { Group } from "types/Group";

interface Signup {
    name: string;
    email: string;
    password: string;
    role: "student" | "teacher" | "";
}

const apiObj = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
    timeout: 10000,
});

const loginUser = (data: { email: string; password: string; role: string }) => {
    return apiObj.post("user/login", data);
};

const registerUser = (data: Signup) => {
    return apiObj.post("user/register", data);
};

const logoutUser = () => {
    return apiObj.get("user/logout");
};

const loginUserByToken = () => {
    return apiObj.get("user/auth");
};

const loginUserByTokenAdmin = () => {
    return apiObj.get("admin/loginbytoken");
};

const getclasses = (id: string) => {
    return apiObj.get(`chat/classes?id=${id}`);
};

const getmembers = (group: Group) => {
    return apiObj.post("/chat/members", group);
};

const getmessages = (group_id: string, page: number) => {
    return apiObj.get(`/chat/messages/${group_id}/${page}`);
};

const getallgroups = () => {
    return apiObj.get(`/admin/groups`);
};

const getTeacher = (teacher_id:string)=>{
    return apiObj.get(`chat/getteacher?teacher_id=${teacher_id}`);
}
const searchstudents = (query:string)=>{
    return apiObj.get(`admin/getsearched_student?prefix=${query}`)
}
const searchteachers = (query:string)=>{
    return apiObj.get(`admin/getsearched_teacher?prefix=${query}`)
}

const getmembersadmin = (member_ids:string[])=>{
    return apiObj.post("admin/getmembers",member_ids);

}
const creategroup = (groupData:any)=>{
    return apiObj.post(`admin/creategroup`,groupData);
}
const editgroup = (grouptobeupdated:any)=>{
    return apiObj.post("admin/editgroup",grouptobeupdated);
}
const deletegroup = (grouptobeDeletedId:string)=>{
    return apiObj.delete(`admin/editgroup?grouptobeDeleteId=${grouptobeDeletedId}`);
}
const getmessagesAdmin = (groupId:string)=>{
    return apiObj.get(`admin/getmessagesAdmin?groupId=${groupId}`);
}
const getUserAdmin = (user_id:string)=>{
    return apiObj.get(`admin/getuser?user_id=${user_id}`);
}

const getUser = (user_id:string)=>{
    return apiObj.get(`admin/getuser?user_id=${user_id}`);
}
const upload_file=(file:FormData)=>{
    return apiObj.post("chat/upload",file);
}

const getinvites = (userid:string)=>{
    return apiObj.get(`chat/getinvites?user_id=${userid}`);
}

const checktoxicity = (message:string)=>{
    return apiObj.post("chat/checktoxicity",{message});
}

//both accept and reject are handled by this
const handle_invite = (response:boolean,inviteId:string)=>{
    return apiObj.post("chat/handlegroupinvite",{response,inviteId});
}
export {
    loginUser,
    registerUser,
    logoutUser,
    loginUserByToken,
    loginUserByTokenAdmin,
    getclasses,
    getmembers,
    getmessages,
    getallgroups,
    getTeacher,
    searchstudents,
    searchteachers,
    creategroup,
    getmembersadmin,
    editgroup,
    deletegroup,
    getmessagesAdmin,
    getUser,
    upload_file,
    checktoxicity,
    getinvites,
    getUserAdmin,
    handle_invite,
};
