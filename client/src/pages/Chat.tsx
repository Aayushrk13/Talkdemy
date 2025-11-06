import Navbar from "@/components/Navbar";
import ChatWindow from "@/components/chat/chatwindow";
import GroupDetails from "@/components/widget/Groupdetail";
import GroupList from "@/components/sidebar/grouplist";
import UserSection from "@/components/sidebar/userlist";
import { useEffect, useState } from "react";
import { useGroup } from "@/context/groupcontext";
import { useUser } from "@/context/usercontext";
import { socket } from "@/socket/socket";
import { getmembers, getmessages } from "@/api";
import type { Group } from "types/Group";
import type { Message } from "types/Message";
import { motion, AnimatePresence } from "framer-motion";
import { ListCollapse } from "lucide-react";
import { usePage } from "@/context/pagecontext";
import type { User } from "../../types/User.ts";

function Chat() {
	const userContext = useUser();

  useEffect(()=>{
    userContext.loginByToken();
  },[])


	useEffect(() => {
    if(!userContext.user)return;
		socket.connect();
		socket.on("message", handlemessageincoming);
		return () => {
			socket.disconnect();
			socket.off("message");
		};
	}, [userContext.user]);

	const groupContext = useGroup();

	useEffect(() => {
		if (userContext.user) {
			groupContext.getgroups(userContext.user._id);
			socket.emit("joinrooms", userContext.user._id);
		}
	}, [userContext.user]);


	const fetchmembers = async (group: Group) => {
		const response = await getmembers(group);
		const { data } = response;
		setmembers(data.members_data);
	};

	const fetchmessages = async (group_id: string, page: number) => {
		if (!group_id || group_id == "") return;
		if (!pageContext.hasMorepages && page>1) return;
		const res = await getmessages(group_id, page);
		const { data } = res;
		if (data.messages.length == 0) {
			pageContext.togglehasMorepages();
		}
		setmessages((prev) => [...data.messages, ...prev]);
	};

	useEffect(() => {
		if (groupContext.groups.length > 0) {
			setcurrentgroup(groupContext.groups[0]);
			fetchmembers(groupContext.groups[0]);
		}
	}, [groupContext.groups]);

	const pageContext = usePage();
	const [currentgroup, setcurrentgroup] = useState<Group>({
		_id: "",
		name: "",
		avatar: "",
		members: [],
		teacher_id: "",
		messages: null,
	});

	useEffect(() => {
		if (!currentgroup._id) return;
    console.log(currentgroup)
		fetchmembers(currentgroup);
		setmessages([]);
		pageContext.resetPage();
		fetchmessages(currentgroup._id, pageContext.page);
	}, [currentgroup]);

	useEffect(() => {
		console.log("page is changed", pageContext.page);
		fetchmessages(currentgroup._id, pageContext.page);
	}, [pageContext.page]);

	const [isanonymous, setisanonymous] = useState(false);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [message, setmessage] = useState("");
	const [messages, setmessages] = useState<Message[]>([]);
	const [members, setmembers] = useState<User[]>([]);

	const toggleAnonymous = () => setisanonymous(!isanonymous);
	const handleinputchange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setmessage(e.target.value);
	const handlemessageincoming = (msg: Message) =>
		setmessages((prev) => [...prev, msg]);

	const handlebuttonclick = () => {
		if (!userContext.user || !currentgroup._id) return;
		const messageobj: Message = {
			sender_id: userContext.user?._id,
			sender_name: isanonymous ? "Anonymous" : userContext.user?.name,
			content: message,
			group_id: currentgroup._id,
			status: "sent",
		};

		setmessages((prev) => [...prev, messageobj]);
		socket.emit("message", messageobj);
		setmessage("");
	};

	const handlegroupclick = (index: number) => {
		setcurrentgroup(groupContext.groups[index]);
	};
	return (
		<div className="h-screen w-screen flex flex-col">
			<Navbar />
			<div className="flex flex-row flex-1 overflow-hidden">
				<div className="border-r border-gray-200 w-1/5 bg-white shadow-md flex flex-col h-screen">
					<UserSection
						userName={userContext.user?.name || "Guest"}
						isAnonymous={isanonymous}
						onToggleAnonymous={toggleAnonymous}
					/>
					<GroupList
						groups={groupContext.groups}
						onGroupClick={handlegroupclick}
					/>
				</div>
				<div className="flex flex-col flex-1">
					<div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white shadow-sm">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold">
								{currentgroup.name?.[0]?.toUpperCase()}
							</div>
							<h2 className="text-gray-800 font-semibold truncate">
								{currentgroup.name}
							</h2>
						</div>
						{!isDetailsOpen && (
							<button
								onClick={() => setIsDetailsOpen(true)}
								className="text-xs rounded px-2 py-1 bg-gray-300 text-white hover:bg-gray-500 transition"
							>
								<ListCollapse />
							</button>
						)}
					</div>

					<ChatWindow
						messages={messages}
						message={message}
						onMessageChange={handleinputchange}
						onSend={handlebuttonclick}
						disabled={!message}
					/>
				</div>

				<AnimatePresence>
					{isDetailsOpen && (
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: 320 }}
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
