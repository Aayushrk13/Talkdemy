import { getUser } from "@/api";
import { useUser } from "@/context/usercontext";
import { Download, X } from "lucide-react";
import { useState, useEffect } from "react";

interface MessageBoxProps {
	content: string;
	sender_id: string;
	sender_name: string;
	fileURL?: string | null;
}

export default function MessageBox({
	content,
	sender_id,
	sender_name,
	fileURL,
}: MessageBoxProps) {
	const userContext = useUser();
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	const fileName = fileURL?.slice(fileURL.indexOf("@") + 1);

	const isOwnmessage =
		sender_id === userContext.user?._id ||
		(userContext.user?.role === "admin" && sender_name === "Admin");

	useEffect(() => {
		if (userContext.user?.role === "admin" && sender_id) {
			const fetchUserCredentials = async () => {
				const response = await getUser(sender_id);
				if (response.data.success) {
					sender_name = response.data.user_name;
				}
			};
			fetchUserCredentials();
		}
	}, [sender_id, userContext.user?.role]);

	const isImage = fileURL && /\.(jpeg|jpg|png|gif|webp)$/i.test(fileURL);
	const isVideo = fileURL && /\.(mp4|mov|avi|wmv|mkv|mp3)$/i.test(fileURL);

	return (
		<div
			className={`flex flex-col ${isOwnmessage ? "items-end" : "items-start"}`}
		>
			<p className="text-xs text-gray-700">
				{isOwnmessage && userContext.user?.isAnonymous
					? "Anonymous"
					: sender_name}
			</p>

			{fileURL ? (
				<div
					className={`max-w-xs p-3 rounded my-1 flex flex-col gap-2 break-words ${
						isOwnmessage && userContext.user?.isAnonymous
							? "bg-black text-white self-end"
							: isOwnmessage
							? "bg-gray-800 text-white self-end"
							: "bg-gray-200 text-black self-start"
					}`}
				>
					{/* Image Preview Thumbnail */}
					{isImage && (
						<img
							src={fileURL}
							alt=""
							onClick={() => setIsPreviewOpen(true)}
							className="max-w-[150px] rounded cursor-pointer hover:opacity-90 transition"
						/>
					)}

					{/* Video Preview */}
					{isVideo && (
						<video
							controls
							preload="metadata"
							className="max-w-[300px] rounded cursor-pointer hover:opacity-90"
						>
							<source src={fileURL} type="video/mp4" />
							<source src={fileURL} />
							Your browser does not support the video tag.
						</video>
					)}

					{/* File Info Row */}
					<div className="flex items-center justify-between gap-2">
						<p className="text-sm font-medium break-all truncate">{fileName}</p>

						{!isVideo && (
							<a
								href={fileURL}
								download
								target="_blank"
								rel="noopener noreferrer"
								className={`flex items-center gap-1 text-sm px-2 py-1 rounded hover:opacity-90 ${
									isOwnmessage && userContext.user?.isAnonymous
										? "bg-white text-black"
										: isOwnmessage
										? "bg-white text-black"
										: "bg-gray-800 text-white"
								}`}
							>
								<Download size={16} />
							</a>
						)}
					</div>
				</div>
			) : (
				<div
					className={`inline-block max-w-xs p-2 rounded my-1 ${
						isOwnmessage && userContext.user?.isAnonymous
							? "bg-black text-white"
							: "bg-gray-200 text-black"
					}`}
				>
					<p className="whitespace-pre-wrap break-words">{content}</p>
				</div>
			)}

			{/* 🔍 Image Preview Modal */}
			{isPreviewOpen && isImage && (
				<div
					className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
					onClick={() => setIsPreviewOpen(false)}
				>
					<div
						className="relative max-w-4xl max-h-[90vh] flex items-center justify-center"
						onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
					>
						<img
							src={fileURL}
							alt="Preview"
							className="max-h-[90vh] rounded-lg shadow-lg"
						/>
						<button
							onClick={() => setIsPreviewOpen(false)}
							className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 transition"
						>
							<X size={20} className="text-black" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
