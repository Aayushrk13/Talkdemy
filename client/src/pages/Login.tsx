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
  useEffect(() => {
    userContext.loginByToken();
  }, []);
  let role = "";
  const navigate = useNavigate();

  const userContext = useUser();
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const handlesubmit = () => {
    console.log("login sent");
    userContext.login({ email: email, password: password, role: role });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className=" flex flex-row w-full justify-center items-center py-4 border-b-2 border-[#A1ADB5] gap-2">
        <Boxes />
        <p className=" font-bold text-2xl">Talkdemy</p>
      </div>
      <div className="flex flex-col items-center h-full w-screen">
        <div className="my-20">
          <p className="text-4xl font-light">Welcome</p>
          <p className="text-xl font-extralight">
            Connect with the class in real time.
          </p>
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
          <Select onValueChange={(value) => (role = value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-96 h-9" onClick={handlesubmit}>
            Login
          </Button>
          <span className="self-center">
            Don't have an account?{" "}
            <a
              className="underline font-medium"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
//context or zustand

export default Login;
