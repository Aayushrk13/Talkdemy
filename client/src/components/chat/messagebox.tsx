import { useUser } from "@/context/usercontext";
import type { Message } from "../../../types/Message";
export default function MessageBox({ messagecontent, User }: Message) {
  const userContext = useUser();
  const isOwnmessage = userContext.user?.email === User?.email;
  return (
    <div
      className={`flex flex-col  ${isOwnmessage ? "items-end" : "items-start"}`}
    >
      <p className="text-xs text-gray-700">{isOwnmessage&&userContext.user?.isAnonymous?"Anonymous":User?.name}</p>
      <div
        className={`inline-block max-w-xs p-2 rounded my-1 ${
          isOwnmessage ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{messagecontent}</p>
      </div>
    </div>
  );
}
