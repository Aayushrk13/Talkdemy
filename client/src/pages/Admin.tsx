import React, { useState, useEffect } from "react";
import ChatWindowAdmin from "@/components/chat/chatwindowadmin";
import { AnimatePresence, motion } from "framer-motion";
import { ListCollapse, Plus, UserPlus, X } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/context/usercontext";
import { useNavigate } from "react-router-dom";
import {
	getallgroups,
	loginUserByTokenAdmin,
	searchstudents,
	searchteachers,
	creategroup,
	getmembersadmin,
	editgroup,
	deletegroup,
	getUser,
} from "@/api";
import type { Group } from "../../types/Group";
import type { User } from "../../types/User";

const AdminGroups: React.FC = () => {
	const [currentGroup, setcurrentGroup] = useState<Group | null>(null);
	useEffect(() => {
		getteacher();
		getmembers();
	}, [currentGroup]);
	const getteacher = async () => {
		if (currentGroup) {
			const response = await getUser(currentGroup?.teacher_id);
			if (response.data.success) {
				setcurrentteacher(response.data.user_name);
			}
		}
	};
	const getmembers = async () => {
		if (currentGroup) {
			const response = await getmembersadmin(currentGroup?.members);
			const members_data = response.data.allMembersofGroup;
			setcurrmembers(
				members_data.map((member: User) => {
					return member.name;
				})
			);
		}
	};
	const userContext = useUser();
	const navigate = useNavigate();
	const [Groups, setGroups] = useState<Group[]>([]);
	const [formData, setFormData] = useState({ name: "", description: "" });
	const [editId, setEditId] = useState<Group | null>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [currentteacher, setcurrentteacher] = useState("");
	const [currmembers, setcurrmembers] = useState<string[]>([]);
	// Member popup states
	const [openMemberDialog, setOpenMemberDialog] = useState(false);
	const [memberSearch, setMemberSearch] = useState("");
	const [memberResults, setMemberResults] = useState<User[]>([]);
	const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

	// Teacher popup states
	const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
	const [teacherSearch, setTeacherSearch] = useState("");
	const [teacherResults, setTeacherResults] = useState<User[]>([]);
	const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);

	const [createSuccess, setcreateSuccess] = useState<Boolean>(false);
	const [editSuccess, seteditSuccess] = useState<Boolean>(false);
	const [deleteSuccess, setdeleteSuccess] = useState<Boolean>(false);
	const [showChat, setshowChat] = useState<Boolean>(true);
	useEffect(() => {
		logintoken();
		fetchGroups();
	}, []);

	const logintoken = async () => {
		const response = await loginUserByTokenAdmin();
		if (!response.data.success) {
			navigate("/admin");
		}
		userContext.setter({ ...response.data.user, isAnonymous: false });
	};

	const fetchGroups = async () => {
		const res = await getallgroups();
		const response = res.data;
		if (response.data) {
			setGroups(response.data);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedTeacher) return;
		if (selectedMembers.length < 1) return;
		const members_id = selectedMembers.map((member) => {
			return member._id;
		});
		const groupData = {
			name: formData.name,
			teacher_id: selectedTeacher._id,
			members: members_id,
			last_message: null,
		};

		if (editId) {
			// await axios.put(`${API_URL}/${editId}`, groupData);
			const response = await editgroup({ ...groupData, _id: editId._id });
			console.log(response);
			if (response.data.success) {
				seteditSuccess(true);
				setTimeout(() => {
					seteditSuccess(false);
				}, 800);
			}
			setEditId(null);
		} else {
			const response = await creategroup(groupData);
			console.log(response);
			if (response.data.success) {
				setcreateSuccess(true);
				setTimeout(() => {
					setcreateSuccess(false);
				}, 800);
			}
		}

		setFormData({ name: "", description: "" });
		setSelectedTeacher(null);
		setSelectedMembers([]);
		fetchGroups();
	};

	const handleEdit = async (group: Group) => {
		setEditId(group);
		formData.name = group.name;
		const memberids = group?.members;
		memberids?.push(group?.teacher_id || "");
		const response = await getmembersadmin(memberids || []);
		const members_data = response.data.allMembersofGroup;
		const teacher = members_data.filter((member: User) => {
			return member.role == "teacher";
		});
		setSelectedTeacher(teacher[0]);
		setTeacherResults(teacher);
		const students = members_data.filter((member: User) => {
			return member.role != "teacher";
		});
		setSelectedMembers(students);
		setMemberResults(students);
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Delete this group?")) return;
		console.log(id);
		const response = await deletegroup(id);
		if (response.data.success) {
			setdeleteSuccess(true);
			setTimeout(() => {
				setdeleteSuccess(false);
			}, 800);
		}
		fetchGroups();
	};

	const handleDetails = (group: Group) => {
		setcurrentGroup(group);
		setshowChat(false);
};

	const handleMemberSearch = async (query: string) => {
		setMemberSearch(query);
		if (query.trim().length < 2) {
			setMemberResults([]);
			return;
		}
		const response = await searchstudents(memberSearch);
		const students = response.data.students;
		setMemberResults(students);
	};

	const toggleMemberSelect = (member: User) => {
		if (selectedMembers.find((m) => m._id === member._id)) {
			setSelectedMembers(selectedMembers.filter((m) => m._id !== member._id));
		} else {
			setSelectedMembers([...selectedMembers, member]);
		}
	};

	const handleTeacherSearch = async (query: string) => {
		setTeacherSearch(query);
		if (query.trim().length < 2) {
			setTeacherResults([]);
			return;
		}
		const response = await searchteachers(teacherSearch);
		const teachers = response.data.teachers;
		setTeacherResults(teachers);
	};

	return (
		<div className="h-screen w-screen flex flex-col">
			<div className="h-14 bg-gray-100 border-b flex items-center px-4 shadow-sm">
				<h1 className="text-lg font-semibold text-gray-700">Admin Dashboard</h1>
			</div>

			<div className="flex flex-row flex-1 overflow-hidden">
				{/* Sidebar */}
				<div className="border-r border-gray-200 w-1/5 bg-white shadow-md flex flex-col">
					<div className="p-4 border-b font-semibold text-gray-700">
						Manage Groups
					</div>
					<div className="flex-1 overflow-y-auto">
						{Groups.map((g) => (
							<div
								key={g._id}
								onClick={() => handleDetails(g)}
								className="p-3 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-center"
							>
								<span>{g.name}</span>
								<div>
									<button
										onClick={(e) => {
											e.stopPropagation();
											setshowChat(true);
											handleEdit(g);
										}}
										className="text-xs text-gray-500 hover:text-gray-700 mr-1"
									>
										Update
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(g._id);
										}}
										className="text-xs text-red-500 hover:text-red-700"
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Main form area */}
				<div className="flex flex-col flex-1">
					<div className="flex items-center justify-between h-14 px-4 border-b bg-white shadow-sm">
						<h2 className="text-gray-800 font-semibold">
							{editId ? "Edit Group" : "Create Group"}
						</h2>
						<div className="flex w-1/8 justify-around">
							<button
								onClick={() => {
									setSelectedMembers([]);
									setSelectedTeacher(null);
									setshowChat(true);
									setEditId(null);
								}}
								className="rounded-2xl size-8 flex items-center justify-center bg-gray-100"
							>
								<Plus size={24} color="black" />
							</button>
							<button
								onClick={() => setIsDetailsOpen(!isDetailsOpen)}
								className="text-xs rounded px-2 py-1 bg-gray-300 text-white hover:bg-gray-500 transition"
							>
								<ListCollapse size={16} />
							</button>
						</div>
					</div>
					{showChat ? (
						<div className="flex-1 p-6 overflow-y-auto">
							<form
								onSubmit={handleSubmit}
								className="flex flex-col gap-3 max-w-lg bg-white p-4 rounded-lg shadow-md"
							>
								{/* {createSuccess && <div className="flex items-center justify-center self-center bg-[#10B981] text-[#065F46] w-90 h-12 rounded-2xl transition-all duration-200 ease-in-out"><p>Class created successfully</p></div>} */}
								{editSuccess && (
									<div className="flex items-center justify-center self-center bg-[#10B981] text-[#065F46] w-90 h-12 rounded-2xl transition-all duration-200 ease-in-out">
										<p>Class created successfully</p>
									</div>
								)}
								<div
									className={`
    fixed top-4 left-1/2 -translate-x-1/2
    flex items-center justify-center
    bg-[#10B981] text-[#065F46]
    px-6 py-3 rounded-2xl
    transition-all duration-300 ease-in-out transform
    ${
			createSuccess
				? "opacity-100 scale-100"
				: "opacity-0 scale-90 pointer-events-none"
		}
  `}
								>
									Class created successfully
								</div>

								<div
									className={`
    fixed top-4 left-1/2 -translate-x-1/2
    flex items-center justify-center
    bg-[#10B981] text-[#065F46]
    px-6 py-3 rounded-2xl
    transition-all duration-300 ease-in-out transform
    ${
			editSuccess
				? "opacity-100 scale-100"
				: "opacity-0 scale-90 pointer-events-none"
		}
  `}
								>
									Class updated successfully
								</div>

								<div
									className={`
    fixed top-4 left-1/2 -translate-x-1/2
    flex items-center justify-center
    bg-[#FEE2E2] text-[#991B1B]
    px-6 py-3 rounded-2xl
    transition-all duration-300 ease-in-out transform
    ${
			deleteSuccess
				? "opacity-100 scale-100"
				: "opacity-0 scale-90 pointer-events-none"
		}
  `}
								>
									Class deleted successfully
								</div>
								{editId && <p>{editId?.name}</p>}
								<Input
									type="text"
									name="name"
									placeholder="Group Name"
									value={formData.name}
									onChange={handleChange}
									required
								/>
								{/* Teacher section */}
								<div>
									<div className="flex justify-between items-center mb-2">
										<label className="font-medium text-sm text-gray-600">
											Teacher
										</label>
										<Button
											type="button"
											size="sm"
											onClick={() => setOpenTeacherDialog(true)}
										>
											<UserPlus size={14} /> Select Teacher
										</Button>
									</div>
									{selectedTeacher ? (
										<div className="text-sm bg-gray-50 px-3 py-2 rounded border">
											{selectedTeacher.name} ({selectedTeacher.email})
										</div>
									) : (
										<div className="text-sm text-gray-400 italic">
											No teacher selected
										</div>
									)}
								</div>

								{/* Member section */}
								<div>
									<div className="flex justify-between items-center mb-2">
										<label className="font-medium text-sm text-gray-600">
											Members
										</label>
										<Button
											type="button"
											size="sm"
											onClick={() => setOpenMemberDialog(true)}
										>
											<UserPlus size={14} /> Add Members
										</Button>
									</div>
									{selectedMembers.length > 0 ? (
										<ul className="space-y-1 text-sm">
											{selectedMembers.map((m) => (
												<li
													key={m._id}
													className="flex justify-between items-center bg-gray-50 px-3 py-1 rounded"
												>
													{m.name} ({m.email})
													<button
														type="button"
														onClick={() =>
															setSelectedMembers(
																selectedMembers.filter((s) => s._id !== m._id)
															)
														}
														className="text-xs text-red-500 hover:text-red-700"
													>
														Remove
													</button>
												</li>
											))}
										</ul>
									) : (
										<div className="text-sm text-gray-400 italic">
											No members selected
										</div>
									)}
								</div>

								<Button
									type="submit"
									className="bg-green-600 text-white hover:bg-green-700"
								>
									{editId ? "Update Group" : "Create Group"}
								</Button>
							</form>
						</div>
					) : (
						<ChatWindowAdmin currentGroup={currentGroup} />
					)}
				</div>

				{/* Details Panel */}
				<AnimatePresence>
					{isDetailsOpen && currentGroup && (
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: 320 }}
							exit={{ width: 0 }}
							transition={{ type: "tween", duration: 0.3 }}
							className="bg-white border-l shadow-md overflow-hidden"
						>
							<div className="flex flex-col h-full">
								<div className="flex items-center justify-between p-4 border-b">
									<h3 className="font-semibold text-gray-700">Group Details</h3>
									<button onClick={() => setIsDetailsOpen(false)}>
										<X size={18} className="text-gray-600" />
									</button>
								</div>
								<div className="p-4 flex-1 overflow-y-auto text-sm text-gray-700">
									<p className="font-semibold text-base">{currentGroup.name}</p>
									<div className="mt-3">
										<span className="font-medium">Teacher:</span>{" "}
										{currentteacher}
									</div>
									<div className="mt-3">
										<span className="font-medium">Members:</span>
										<ul className="list-disc ml-5 mt-1">
											{currmembers.map((member_name) => (
												<p>{member_name}</p>
											))}
										</ul>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Teacher Dialog */}
			<Dialog open={openTeacherDialog} onOpenChange={setOpenTeacherDialog}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Select Teacher</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<Input
							placeholder="Search by email..."
							value={teacherSearch}
							onChange={(e) => handleTeacherSearch(e.target.value)}
						/>
						<ScrollArea className="mt-3 h-56 border rounded-md">
							{teacherResults.map((t) => (
								<div
									key={t._id}
									onClick={() => {
										if (selectedTeacher?._id == t._id) {
											setSelectedTeacher(null);
											return;
										}
										setSelectedTeacher(t);
									}}
									className={`p-2 border-b cursor-pointer text-sm ${
										selectedTeacher?._id === t._id
											? "bg-blue-100 border-blue-300"
											: "hover:bg-gray-100"
									}`}
								>
									{t.name} ({t.email})
								</div>
							))}
						</ScrollArea>
					</div>
					<DialogFooter>
						<Button
							variant="secondary"
							onClick={() => setOpenTeacherDialog(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={() => setOpenTeacherDialog(false)}
							disabled={!selectedTeacher}
						>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{/* Member Dialog */}
			<Dialog open={openMemberDialog} onOpenChange={setOpenMemberDialog}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Add Members</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<Input
							placeholder="Search by email..."
							value={memberSearch}
							onChange={(e) => handleMemberSearch(e.target.value)}
						/>
						<ScrollArea className="mt-3 h-56 border rounded-md">
							{memberResults.map((user) => (
								// <NameBox user = {user}></NameBox>
								<div
									key={user._id}
									onClick={() => toggleMemberSelect(user)}
									className={`p-2 border-b cursor-pointer text-sm ${
										selectedMembers.find((m) => m._id === user._id)
											? "bg-green-100 border-green-300"
											: "hover:bg-gray-100"
									}`}
								>
									{user.name} ({user.email})
								</div>
							))}
						</ScrollArea>
					</div>
					<DialogFooter>
						<Button
							variant="secondary"
							onClick={() => setOpenMemberDialog(false)}
						>
							Cancel
						</Button>
						<Button onClick={() => setOpenMemberDialog(false)}>Confirm</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AdminGroups;
