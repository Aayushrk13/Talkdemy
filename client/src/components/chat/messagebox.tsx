import { getUser } from "@/api";
import { useUser } from "@/context/usercontext";
import { useState } from "react";
interface MessageBoxProps{
  content:string;
  sender_id : string;
  sender_name : string
}
export default function MessageBox({ content, sender_id, sender_name }: MessageBoxProps) {
  const userContext = useUser();
  const [sendername,setsendername] = useState(sender_name);
  const isOwnmessage =sender_id === userContext.user?._id||(userContext.user?.role == 'admin' && sender_name == "Admin") ?true:false;
  const fetchUserCredentials = async(user_id:string)=>{
    const response = await getUser(user_id);
    if(response.data.success){
      setsendername(response.data.user_name);
    }
  }
  if(userContext.user?.role == 'admin'){
    fetchUserCredentials(sender_id);
  }
  return (
    <div
      className={`flex flex-col  ${isOwnmessage ? "items-end" : "items-start"}`}
    >
      <p className="text-xs text-gray-700">{isOwnmessage&&userContext.user?.isAnonymous?"Anonymous":sendername}</p>
      <div
        className={`inline-block max-w-xs p-2 rounded my-1 ${
          isOwnmessage && userContext.user?.isAnonymous? "bg-black-500 text-white" : "bg-gray-200"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}
