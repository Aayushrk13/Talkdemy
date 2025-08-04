import { Boxes } from "lucide-react";
import {Button} from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
function Signup(){
    return(<div>
    <div className=" flex flex-row w-full justify-center items-center py-4 border-b-2 border-[#A1ADB5] gap-2">
        <Boxes />
        <p className=" font-bold text-2xl">Talkdemy</p>
    </div>
    <div className="flex flex-col items-center h-full w-screen">
        <div className="my-20">
            <p className="text-3xl font-light">Join Talkdemy to connect with the class</p>
        </div>
        <form action="tbd" method="get">
            <div className=" flex gap-6 flex-col">
                <Input type="text" placeholder="Full Name" className="h-9 w-96"></Input>
                <Input type="email" placeholder="Email" className="h-9 w-96"></Input>
                <Input type="password" placeholder="Password" className="w-96 h-9"></Input>
                <Input type="password" placeholder="Confirm Password" className="w-96 h-9"></Input>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                </Select>
                <Button className="w-96 h-9">SignUp</Button>
            </div>
        </form>
    </div>
    </div>);
}

export default Signup