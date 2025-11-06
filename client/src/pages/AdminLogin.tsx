import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/api";
import { useEffect, useState } from "react";
import { useUser } from "@/context/usercontext";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();
	const userContext = useUser();
	const [email, setemail] = useState<string>("");
	const [password, setpassword] = useState<string>("");
	const handlesubmit = () => {
		console.log("login sent");
		handlelogin({ email: email, password: password, role: "admin" });
	};
	const handlelogin = async (loginCredentials: {
		email: string;
		password: string;
		role: string;
	}) => {
		const response = await loginUser(loginCredentials);
		const res_data = response.data;
		if (!res_data.success) return;
		userContext.setter({ ...res_data.user, isAnonymous: false });
		navigate("/admin/home");
	};

	return (
		<div className="h-screen flex flex-col">
			<div className=" flex flex-row w-full justify-center items-center py-4 border-b-2 border-[#A1ADB5] gap-2">
				<Boxes />
				<p className=" font-bold text-2xl">Talkdemy</p>
				<p className=" font-bold text-xl ml-2">Admin</p>
			</div>
			<div className="flex flex-col items-center h-full w-screen">
				<div className="my-20">
					<p className="text-4xl font-light">Welcome</p>
				</div>
				<div className=" flex gap-6 flex-col">
					<Input
						type="email"
						placeholder="Email"
						className="h-9 w-96"
						name="email"
						required
						onChange={(e) => {
							setemail(e.target.value);
						}}
					></Input>
					<Input
						type="password"
						placeholder="Password"
						className="w-96 h-9"
						name="password"
						required
						onChange={(e) => {
							setpassword(e.target.value);
						}}
					></Input>
					<Button className="w-96 h-9" onClick={handlesubmit}>
						Login
					</Button>
				</div>
			</div>
		</div>
	);
}
//context or zustand

export default Login;
