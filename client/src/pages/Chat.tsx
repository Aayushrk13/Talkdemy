import Navbar from "@/components/Navbar";
import { ListCollapse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBox from "@/components/chat/messagebox";
import GroupDetails from "@/components/widget/Groupdetail";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useGroup } from "@/context/groupcontext";
import { useUser } from "@/context/usercontext";
import { socket } from "@/socket/socket";
import { getmembers } from "@/api";
import type { Group } from "types/Group";
import type { Message } from "../../types/Message";

function Chat() {
  const userContext = useUser();
  const groupContext = useGroup();
  const [isanonymous, setisanonymous] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [message, setmessage] = useState<string>("");
  const [messages, setmessages] = useState<Message[]>([
    {
      content: "dummy",
      group_id: "102",
      sender_name: "dummy",
      sender_id: "101",
      status: "delivered",
    },
  ]);
  const [currentgroup, setcurrentgroup] = useState<Group>({
    _id: "68ae9919c3d5eb93d3748a60",
    name: "aayush",
    avatar: "test",
    members: [],
    teacher_id: "t_id",
    messages: null,
  }); //send sorted data on the basis of latest updated from back

  const [members, setmembers] = useState<any[]>([]);

  //login bby JWT and connect socket with the backend
  //handle the incoming message from the socket of backend
  useEffect(() => {
    userContext.loginByToken();
    socket.connect();
    socket.on("message", handlemessageincoming);
    return () => {
      socket.disconnect();
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    if (userContext.user) {
      groupContext.getgroups(userContext.user._id);
      socket.emit("joinrooms", userContext.user._id); //!!
    }
  }, [userContext.user]);

  useEffect(() => {
    if (groupContext.groups.length > 0) {
      setcurrentgroup(groupContext.groups[0]);
      fetchmembers(groupContext.groups[0].members);
    }
  }, [groupContext.groups]);

  useEffect(() => {
    fetchmembers(currentgroup.members);
  }, [currentgroup]);
  //use typescript types to form classes
  //   // Update current group when groups are fetched
  //make UI for groups and create logic of current group with UI

  const toggleAnonymous = () => {
    setisanonymous(!isanonymous);
  };

  const fetchmembers = async (members_id: string[]) => {
    const response = await getmembers(members_id);
    const { data } = response;

    setmembers(data.members_data);
  };

  const handleinputchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setmessage(e.target.value);
  };
  const handlemessageincoming = (message_data: Message, group_data: Group) => {
    console.log(group_data);
    setmessages((prev)=>[...prev,message_data])
  };

  const handlebuttonclick = () => {
    let messageobj = {
      sender_id: userContext.user?._id,
      sender_name: isanonymous ? "Anonymous" : userContext.user?.name,
      content: message,
      group_id: currentgroup._id,
      status: "sent",
    } as Message;

    setmessages((prev) => [...prev, messageobj]);
    socket.emit("message", messageobj, currentgroup);
    setmessage("");
  };

  const handlegroupclick = (index: number) => {
    setcurrentgroup(groupContext.groups[index]);
    console.log(currentgroup);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar></Navbar>
      <div className="flex flex-row flex-1 overflow-hidden ">
        <div className="border-r border-gray-200 w-1/5 bg-white shadow-md flex flex-col h-screen">
          {/* User Section */}
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="flex flex-col">
              <p className="text-gray-900 font-semibold truncate">
                {userContext.user?.name}
              </p>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center gap-2 p-4 border-b">
            <Switch checked={isanonymous} onCheckedChange={toggleAnonymous} />
            <p className="text-sm text-gray-600">
              {isanonymous ? "Hidden" : "Visible"}
            </p>
          </div>

          {/* Groups List */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-3">
              Classes / Groups
            </p>
            <div className="space-y-1">
              {groupContext.groups.map((classes, index) => (
                <div
                  key={index}
                  onClick={() => handlegroupclick(index)}
                  className="px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition truncate"
                >
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-xs font-semibold">
                    {classes.name[0].toUpperCase()}
                  </div>
                  <span className="truncate">{classes.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 ">
          <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white shadow-sm">
            {/* Group Info */}
            <div className="flex items-center gap-2">
              {/* Circle avatar with group initial */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold">
                {currentgroup.name?.[0].toUpperCase()}
              </div>
              <h2 className="text-gray-800 font-semibold truncate">
                {currentgroup.name}
              </h2>
            </div>{" "}
            <button
              onClick={() => setIsDetailsOpen(true)}
              className="text-xs rounded px-2 py-1 bg-gray-300 text-white hover:bg-gray-500 transition"
            >
              <ListCollapse />
            </button>
          </div>

          <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden ">
            {/*make a chatting UI widget for modularization*/}
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
        <AnimatePresence>
          {isDetailsOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 320 }} // fixed width drawer
              exit={{ width: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="bg-white border-l shadow-md overflow-hidden"
            >
              <GroupDetails
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                currentgroup={currentgroup}
                members={members}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Chat;
