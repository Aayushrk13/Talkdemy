import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/usercontext";

interface Signup{
    name:string,
    email:string,
    password:string,
    role:"student" | "teacher" | ""
}
function Signup() {
    const navigate = useNavigate();
    const userContext = useUser();

    const [reg_data, setreg_data] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });

    const [password, setpassword] = useState<string>("");
    const [confpassword, setconfpassword] = useState<string>("");

    // ✅ email validation regex
    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // ✅ form validity
    const isFormValid =
        reg_data.name.trim().length > 0 &&
        isValidEmail(reg_data.email) &&
        password.length >= 8 &&
        password === confpassword &&
        reg_data.role !== "";

        const handleregister = ()=>{
            userContext.register(reg_data as Signup);
        }

    return (
        <div>
        <div className="flex flex-row w-full justify-center items-center py-4 border-b-2 border-[#A1ADB5] gap-2">
            <Boxes />
            <p className="font-bold text-2xl">Talkdemy</p>
        </div>

        <div className="flex flex-col items-center h-full w-screen">
            <div className="my-20">
            <p className="text-3xl font-light">
                Join Talkdemy to connect with the class
            </p>
            </div>

            <div className="flex gap-6 flex-col">
            <Input
                type="text"
                placeholder="Full Name"
                className="h-9 w-96"
                onChange={(e) => {
                setreg_data({ ...reg_data, name: e.target.value });
                }}
            />

            <Input
                type="email"
                placeholder="Email"
                className={`h-9 w-96 ${
                reg_data.email && !isValidEmail(reg_data.email)
                    ? "border-red-500"
                    : ""
                }`}
                onChange={(e) => {
                setreg_data({ ...reg_data, email: e.target.value });
                }}
            />
            {reg_data.email && !isValidEmail(reg_data.email) && (
                <p className="text-red-500 text-sm">Invalid email format</p>
            )}

            <Input
                type="password"
                placeholder="Password"
                className="w-96 h-9"
                onChange={(e) => {
                setpassword(e.target.value);
                setreg_data({...reg_data,password:e.target.value});
                }}
            />
            {password && password.length < 8 && (
                <p className="text-red-500 text-sm">
                Password must be at least 8 characters
                </p>
            )}

            <Input
                type="password"
                placeholder="Confirm Password"
                className="w-96 h-9"
                onChange={(e) => {
                setconfpassword(e.target.value);
                }}
            />
            {confpassword && confpassword !== password && (
                <p className="text-red-500 text-sm">Passwords do not match</p>
            )}

            <Select onValueChange={(value) => setreg_data({ ...reg_data, role: value })}
            >
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
            </Select>
            <Button className="w-96 h-9" disabled={!isFormValid} onClick={handleregister}>
                SignUp
            </Button>
            <span className="self-center">
                Already have an account?{" "}
                <a
                className="underline font-medium cursor-pointer"
                onClick={() => {
                    navigate("/");
                }}
                >
                Login
                </a>
            </span>
            </div>
        </div>
        </div>
    );
    }

    export default Signup;
