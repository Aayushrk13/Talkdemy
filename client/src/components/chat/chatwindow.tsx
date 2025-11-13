import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MessageBox from "@/components/chat/messagebox";
import type { Message } from "types/Message";
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useEffect, useRef } from "react";
import { usePage } from "@/context/pagecontext";
import { Upload, X } from "lucide-react";
import { useUser } from "@/context/usercontext";
import type { Socket } from "socket.io-client";
import { upload_file } from "@/api";

interface ChatWindowProps {
	messages: Message[];
	message: string;
	onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSend: () => void;
	disabled?: boolean;
	socket: Socket;
	group_id: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
	messages,
	message,
	onMessageChange,
	onSend,
	socket,
	group_id,
}) => {
	const userContext = useUser();
	const divRef = useRef<HTMLDivElement>(null);
	const [sendDisabled, setSendDisabled] = useState<boolean>(true);
	const fileinputRef = useRef<HTMLInputElement>(null);
	const pageContext = usePage();
	const div = divRef.current;
	const prevScrollHeightRef = useRef<number>(0);
	const [file, setfile] = useState<File | null>(null);
	useEffect(() => {
	console.log(messages)
	}, [messages]);
	useEffect(() => {
		if (div) {
			div.scrollTop = div.scrollHeight;
			const newHeight = div.scrollHeight;
			div.scrollTop = newHeight - prevScrollHeightRef.current; // preserve position
		}
	}, [messages]);

	const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		onMessageChange(e);
		setSendDisabled(e.target.value.trim().length === 0 && !file);
	};

	const handleScroll = () => {
		if (!div) return;
		if (!pageContext.hasMorepages) return;
		if (div.scrollTop === 0) {
			prevScrollHeightRef.current = div.scrollHeight;
			pageContext.getmorePages();
			console.log("top is here call for more data");
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		console.log(selectedFile);
		console.log(e.target.files);
		if (selectedFile) {
			setfile(selectedFile);
			setSendDisabled(false);
		}
	};
	const removeFile = () => {
		setfile(null);
		setSendDisabled(message.trim().length === 0);
		if (fileinputRef.current) {
			fileinputRef.current.value = "";
		}
	};
	const handleSubmit = async (e: FormEvent) => {
		if (!userContext.user?._id) return;
		e.preventDefault();
    if(message.length>0) onSend();

		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		formData.append("group_id", group_id);
		formData.append("user_id", userContext.user._id);
		formData.append("sender_name", userContext.user.name);
		const res = await upload_file(formData);
		if (res.data.success) setfile(null);
	};
	return (
		<div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden ">
			<div
				className="overflow-y-auto m-2 flex flex-col scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
				onScroll={handleScroll}
				ref={divRef}
			>
				{messages.map((msg: Message, index: number) => (
					<MessageBox {...msg} key={index} />
				))}
			</div>
			<div className="border-t border-gray-300">
				{file && (
					<div className="float-right mr-8 flex items-center">
						{" "}
						<X
							color="red"
							size={22}
							onClick={() => {
								removeFile();
							}}
						/>
						Selected file :{file.name} ({(file.size / 1024).toFixed(2)} KB)
					</div>
				)}
				<div className="w-full flex gap-6 pb-4 px-4">
					<Label htmlFor="files">
						<Upload />
					</Label>
					<form className="w-full flex gap-6" onSubmit={handleSubmit}>
						<Input
							ref={fileinputRef}
							type="file"
							id="files"
							multiple
							className="hidden"
							onChange={(e) => {
								handleFileChange(e);
							}}
						/>
						<Input
							type="text"
							className="border-2 border-primary flex-1"
							placeholder="Type your message..."
							value={message}
							onChange={handleMessageInput}
						/>
						<Button type="submit" disabled={sendDisabled}>
							Send
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ChatWindow;
