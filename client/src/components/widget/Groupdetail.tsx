import { getTeacher } from "@/api";
import { useGroup } from "@/context/groupcontext";
import { useUser } from "@/context/usercontext";
import { socket } from "@/socket/socket";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { Group } from "types/Group";
import type { User } from "types/User";

export default function GroupDetails({
	isOpen,
	onClose,
	currentgroup,
	setcurrentgroup,
	members,
}: any) {
	const [teacher_name, setteacher_name] = useState<string>("");
	const userContext = useUser();
	const groupContext = useGroup();

	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		user: User | null;
	} | null>(null);

	useEffect(() => {
		if (!currentgroup?.teacher_id) return;
		fetchteachername();
	}, [currentgroup.teacher_id]);

	useEffect(()=>{
		socket.on("createdirectchat:fail:chatexists",gotoExistingChat)
		socket.on("createdirectchat:success:groupcreated",gotoNewChat);
	},[])
	
	const gotoExistingChat = (chat:Group)=>{
		setcurrentgroup(chat);	
	}
	const gotoNewChat = (newChat:Group)=>{
		groupContext.updateGroups(newChat);
		setcurrentgroup(newChat);		
	}
	useEffect(() => {
		const closeMenu = () => setContextMenu(null);
		window.addEventListener("click", closeMenu);
		return () => window.removeEventListener("click", closeMenu);
	}, []);

	const fetchteachername = async () => {
		const response = await getTeacher(currentgroup.teacher_id);
		const teacher = response.data.teacher as User;
		setteacher_name(teacher.name);
	};

	const handleRightClick = (e: React.MouseEvent, user: User) => {
		e.preventDefault();
		setContextMenu({
			x: e.clientX,
			y: e.clientY,
			user,
		});
	};

	const createDirectChat = (creatorId : string,receiverId : string)=>{
		socket.emit("createDirectChat",{creatorId,receiverId});
	}
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ x: "100%" }}
					animate={{ x: 0 }}
					exit={{ x: "100%" }}
					transition={{ type: "spring", stiffness: 120, damping: 20 }}
					className="top-0 right-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col"
				>
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b">
						<h1 className="text-lg font-semibold text-gray-800">
							Group Details
						</h1>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 transition"
						>
							✕
						</button>
					</div>

					<div className="px-4 py-3 border-b">
						<p className="text-sm text-gray-500">Group Name</p>
						<p className="text-gray-800 font-medium">{currentgroup.name}</p>
					</div>

					<div className="flex-1 overflow-y-auto p-4">
						<h2 className="text-md font-semibold text-gray-700 mb-2">
							Teacher
						</h2>
						<div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
							<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">
								{teacher_name && teacher_name[0].toUpperCase()}
							</div>
							<span className="text-gray-800">{teacher_name}</span>
						</div>

						<h2 className="text-md font-semibold text-gray-700 mt-4 mb-2">
							Members
						</h2>

						<div className="space-y-2">
							{members.map((member: User) => (
								<div
									key={member._id}
									onContextMenu={(e) => handleRightClick(e, member)}
									className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-200 transition cursor-pointer"
								>
									<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">
										{member.name[0].toUpperCase()}
									</div>
									<span className="text-gray-800">{member.name}</span>
								</div>
							))}
						</div>
					</div>

					{contextMenu && (
						<div
							style={{
								top: contextMenu.y,
								left: contextMenu.x,
							}}
							className="fixed z-[9999] bg-white border rounded-lg shadow-lg w-32"
						>
							<button
								onClick={() => {
									createDirectChat(userContext.user?._id || "",contextMenu.user?._id || "");
									setContextMenu(null);
								}}
								className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
							>
								Chat
							</button>
						</div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
