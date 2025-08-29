import { useUser } from "@/context/usercontext";
interface MessageBoxProps{
  content:string;
  sender_id : string;
  sender_name : string
}
export default function MessageBox({ content, sender_id, sender_name }: MessageBoxProps) {
  const userContext = useUser();
  const isOwnmessage =sender_id === userContext.user?._id?true:false;
  return (
    <div
      className={`flex flex-col  ${isOwnmessage ? "items-end" : "items-start"}`}
    >
      <p className="text-xs text-gray-700">{isOwnmessage&&userContext.user?.isAnonymous?"Anonymous":sender_name}</p>
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
