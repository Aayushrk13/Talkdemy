import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/usercontext";
import { socket } from "@/socket/socket";
import MessageBox from "@/components/chat/messagebox";
import type { Message } from "../../types/Message";
import { useGroup } from "@/context/groupcontext";
import { Switch } from "@/components/ui/switch";
function Chat() {
  const userContext = useUser();
  const groupContext = useGroup();
  useEffect(() => {
    userContext.loginByToken();
    socket.connect();
    socket.on("message",handlemessageincoming);
    return ()=>{
      socket.disconnect();
      socket.off("message");
    }
  }, []);
  useEffect(() => {
    if (userContext.user) {
      groupContext.getgroup(userContext.user?._id || "");
      socket.emit("joinrooms",userContext.user._id);
    }
  }, [userContext]);
  //use typescript types to form classes
  //make UI for groups and create logic of current group with UI
  const classes_data = groupContext.group ?? [];
  const [message, setmessage] = useState<string>("");
  const [messages, setmessages] = useState<Message[]>([
    {
      messagecontent: "dummy",
      messageid: "102",
      User: null,
    },
  ]);
  const handleinputchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setmessage(e.target.value);
  };
  const handlemessageincoming = (message_data : Message)=>{
    setmessages(prev => [...prev,message_data]);
  }
  const handlebuttonclick = () => {
    let messageobj = {
      messageid: userContext.user?._id ?? null,
      User: userContext.user,
      messagecontent: message,
    };
    setmessages([...messages, messageobj]);
    socket.emit("message", messageobj, classes_data[0]);
    setmessage("");
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar></Navbar>
      <div className="flex flex-row flex-1 overflow-hidden ">
        <div className="border-r-2 border-[#A1ADB5] w-1/5 overflow-hidden">
          <div className="flex flex-row items-center mb-1">
            <div>
              <img src="@/assets/react.svg" alt="Profile picture" />
            </div>
            {userContext.user?.name}
          </div>
          <div className="flex items-center ml-2 gap-2">
            <Switch
              checked={!!userContext.user?.isAnonymous}
              onCheckedChange={userContext.toggleAnonymous}
            />
            <p>{userContext.user?.isAnonymous ? "Hidden" : "Visible"}</p>
          </div>
          <p className="text-base ml-2 mt-3">Classes/Groups</p>
          {classes_data.map((classes) => (
            <div
              key={classes_data.indexOf(classes)}
              className="mb-2 ml-2 flex text-sm"
            >
              <div className="ml-1 truncate">{classes.name}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col flex-1">
          <div className=" border-2 border-amber-800 h-12">
            Class name and avatar
          </div>
          <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden ">
            <div className="overflow-y-auto m-2 flex flex-col scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {messages.map((msg: Message) => {
                return <MessageBox {...msg} key={messages.indexOf(msg)} />;
              })}
            </div>
            <div className="w-full flex gap-6 p-4 border-t border-gray-300">
              <Input
                type="text"
                className="border-2 border-primary flex-1"
                placeholder="Type your message..."
                value={message}
                onChange={handleinputchange}
              />
              <Button onClick={handlebuttonclick} disabled={!message}>
                Send
              </Button>
            </div>
          </div>
        </div>
        <div className="border-l-2 border-[#A1ADB5] w-1/4 overflow-hidden">
          <h1>Class details</h1>
          <p>class name</p>//put the current class names by making the mapped
          class elements clickable
          <p>members</p>
          <p>files???</p>
        </div>
      </div>
    </div>
  );
}

export default Chat;
