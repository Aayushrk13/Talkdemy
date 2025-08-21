import { useUser } from "@/context/usercontext";
import type {Message} from "../../../types/Message"
export default function MessageBox({messagecontent,User}:Message){
    const userContext = useUser();
    const isOwnmessage = userContext.user?.email === User?.email;
    return(
         <div
      className={`inline-block max-w-xs p-3 rounded my-3 ${isOwnmessage ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"}`}
    >
      <p className="whitespace-pre-wrap break-words">{messagecontent}</p>
    </div>
    );
}