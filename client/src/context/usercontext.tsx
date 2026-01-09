import type { User } from "../../types/User";
import { loginUser, registerUser, logoutUser, loginUserByToken } from "../api";
import { useNavigate } from "react-router-dom";
import React, {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";
interface Signup {
	name: string;
	email: string;
	password: string;
	role: "student" | "teacher" | "";
}
export const UserContext = createContext<{
	user: User | null;
	login: (data: {
		email: string;
		password: string;
		role: string;
	}) => Promise<void>;
	register: (data: Signup) => Promise<void>;
	logout: () => Promise<void>;
	loginByToken: () => Promise<void>;
	setter: (user: User) => void;
}>({
	user: null,
	login: async () => {},
	register: async () => {},
	logout: async () => {},
	loginByToken: async () => {},
	setter: () => {},
});

export const useUser = () => {
	const user = useContext(UserContext);
	if (user === undefined)
		throw new Error("useUser must be using inside the provider");
	return user;
};


export const UserProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const navigate = useNavigate();

	const [user, setuser] = useState<User | null>(null);
	const setter = (user: User) => {
		setuser(user);
	};
	const login = async (data: {
		email: string;
		password: string;
		role: string;
	}) => {
		try {
			const response = await loginUser(data);
			const res_data = response.data;
			setuser({ ...res_data.user, isAnonymous: false });
			navigate("/chat");
		} catch (e: any) {
			console.log(e.message);
			throw new Error(e);
		}
	};
	const register = async (data: Signup) => {
		try {
			const response = await registerUser(data);
			if (response.data.success) {
				navigate("/login");
			}
		} catch (e: any) {
			console.log(e.message);
			throw new Error(e);
		}
	};
	const logout = async () => {
		try {
			const response = await logoutUser();
			if (response.data.success) {
				setuser(null);
				navigate("/");
			}
		} catch (e: any) {
			console.log(e.message);
		}
	};
	const loginByToken = async () => {
		try {
			const response = await loginUserByToken();
			const res_data = response.data;
			console.log(res_data);
			if (res_data.success) {
				setuser({ ...res_data.user, isAnonymous: false });
				if (window.location.pathname !== "/chat") {
					navigate("/chat");
				}
			} else {
				navigate("/login");
			}
		} catch (e: any) {
			console.log(e.message);
		}
	};
	const value = useMemo(
		() => ({ user, login, register, logout, loginByToken, setter }),
		[user]
	);
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
