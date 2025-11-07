import type { Group } from "types/Group";
import ChatWindow from "./chatwindow";
import { useEffect, useState } from "react";
import type { Message } from "types/Message";
import { getmessagesAdmin } from "@/api";
import { socket } from "@/socket/socket";
interface ChatWindowAdminProps {
	currentGroup: Group | null;
}
const ChatWindowAdmin: React.FC<ChatWindowAdminProps> = ({ currentGroup }) => {
	useEffect(() => {
		//get messages
		fetchmessages(currentGroup?._id);
	}, [currentGroup]);

	useEffect(() => {
		socket.connect();
		socket.on("message", handlemessageincoming);
        socket.emit("joinrooms","admin");
		return () => {
			socket.disconnect();
			socket.off("message");
		};
	}, []);
	const [messages, setmessages] = useState<Message[]>([]);
	const [message, setmessage] = useState("");
	const handlemessageincoming = (msg: Message) =>
		setmessages((prev) => [...prev, msg]);
	const handleinputchange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setmessage(e.target.value);
	const fetchmessages = async (groupId: string | undefined) => {
		if (groupId) {
			const response = await getmessagesAdmin(groupId);
			setmessages(response.data.messages);
		}
	};
	const handlebuttonclick = () => {
		if (!currentGroup?._id) return;
		const messageobj: Message = {
			sender_id: "690c8993402ce15f6a748a5f",
			sender_name: "Admin",
			content: message,
			group_id: currentGroup._id,
			status: "sent",
		};
        

		setmessages((prev) => [...prev, messageobj]);
        socket.emit("message",messageobj);
		setmessage("");
	};

	return (
		<>
			<ChatWindow
				messages={messages}
				message={message}
				onMessageChange={handleinputchange}
				onSend={handlebuttonclick}
				disabled={!message}
			></ChatWindow>
		</>
	);
};

export default ChatWindowAdmin;
