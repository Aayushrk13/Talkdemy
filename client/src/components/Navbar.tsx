import { useUser } from "@/context/usercontext";
import { Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";
function Navbar() {
	const userContext = useUser();
	const logout = () => {
		userContext.logout();
	};
	const navigate = useNavigate();
	return (
		<>
			<div className=" flex flex-row h-10 w-full justify-between items-center py-6 border-b-2 border-[#A1ADB5]">
				<div className=" flex flex-row items-center justify-between ml-8">
					<Boxes />
					<p className=" font-bold text-2xl">Talkdemy</p>
				</div>
				<div className=" flex flex-row w-1/3 justify-end mr-8">
					<p onClick={() => {
                        navigate("/");
                    }}>Home</p>
					<p onClick={logout} className="cursor-pointer">
						Log out
					</p>
				</div>
			</div>
		</>
	);
}

export default Navbar;
