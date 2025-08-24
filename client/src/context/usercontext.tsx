import type { User } from "../../types/User";
import { loginUser, registerUser, logoutUser, loginUserByToken } from "../api";
import { useNavigate } from "react-router-dom";
import React, {
  createContext,
  useContext,
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
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: Signup) => Promise<void>;
  logout: () => Promise<void>;
  loginByToken: () => Promise<void>;
  toggleAnonymous : ()=>void;
}>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginByToken: async () => {},
  toggleAnonymous:()=>{},
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
  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await loginUser(data);
      const res_data = response.data;
      setuser({...res_data.user,isAnonymous:false});
      navigate("/chat");
    } catch (e: any) {
      console.log(e.message);
    }
  };
  const register = async (data: Signup) => {
    try {
      const response = await registerUser(data);
      if (response.data.success) {
        navigate("/");
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };
  const logout = async () => {
    try {
      const response = await logoutUser();
      if (response.data.success) {
        setuser(null);
        navigate("/login");
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };
  const loginByToken = async () => {
    try {
      const response = await loginUserByToken();
      const res_data = response.data;
      setuser({...res_data.user,isAnonymous:false});
      navigate("/chat");
    } catch (e: any) {
      console.log(e.message);
      navigate("/");
    }
  };

  const toggleAnonymous=()=>{
    setuser(prev => prev ? {...prev,isAnonymous:!prev.isAnonymous}:prev);
  }
  return (
    <UserContext.Provider
      value={{ user, login, register, logout, loginByToken,toggleAnonymous }}
    >
      {children}
    </UserContext.Provider>
  );
};
