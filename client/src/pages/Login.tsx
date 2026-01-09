import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useUser } from "@/context/usercontext";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();
	const userContext = useUser();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [role, setRole] = useState<string>("");
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		role?: string;
		general?: string;
	}>({});
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		userContext.loginByToken();
	}, []);

	const validateForm = () => {
		let valid = true;
		const newErrors: typeof errors = {};

		if (!email) {
			newErrors.email = "Email is required.";
			valid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Please enter a valid email address.";
			valid = false;
		}

		if (!password) {
			newErrors.password = "Password is required.";
			valid = false;
		} else if (password.length < 8) {
			newErrors.password = "Password must be at least 8 characters.";
			valid = false;
		}

		if (!role) {
			newErrors.role = "Please select a role.";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;
		setLoading(true);
		setErrors({});

		try {
			await userContext.login({ email, password, role });
		} catch (e: any) {
			let message = "An unexpected error occurred. Please try again.";
			if (e.message.includes("404")) {
				message = "User not found. Please check your email.";
			} else if (e.message.includes("401") || e.message.includes("Invalid")) {
				message = "Incorrect email or password.";
			} else if (e.message.includes("Network")) {
				message = "Network error. Please check your connection.";
			}

			setErrors({ general: message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-screen flex flex-col">
			<div
				className="flex flex-row w-full justify-center items-center py-4 border-b-2 border-[#A1ADB5] gap-2"
				onClick={() => {
					navigate("/");
				}}
			>
				<Boxes />
				<p className="font-bold text-2xl">Talkdemy</p>
			</div>

			<div className="flex flex-col items-center h-full w-screen">
				<div className="my-20 text-center">
					<p className="text-4xl font-light">Welcome</p>
					<p className="text-xl font-extralight">
						Connect with the class in real time.
					</p>
				</div>

				<div className="flex gap-6 flex-col">
					<div>
						<Input
							type="email"
							placeholder="Email"
							className="h-9 w-96"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">{errors.email}</p>
						)}
					</div>

					<div>
						<Input
							type="password"
							placeholder="Password"
							className="w-96 h-9"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">{errors.password}</p>
						)}
					</div>

					<div>
						<Select onValueChange={(value) => setRole(value)}>
							<SelectTrigger className="w-96">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="student">Student</SelectItem>
								<SelectItem value="teacher">Teacher</SelectItem>
							</SelectContent>
						</Select>
						{errors.role && (
							<p className="text-red-500 text-sm mt-1">{errors.role}</p>
						)}
					</div>

					{errors.general && (
						<p className="text-red-600 text-center text-sm -mt-2">
							{errors.general}
						</p>
					)}

					<Button
						className="w-96 h-9"
						onClick={handleSubmit}
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</Button>

					<span className="self-center">
						Don’t have an account?{" "}
						<a
							className="underline font-medium cursor-pointer"
							onClick={() => navigate("/signup")}
						>
							Sign up
						</a>
					</span>
				</div>
			</div>
		</div>
	);
}

export default Login;
