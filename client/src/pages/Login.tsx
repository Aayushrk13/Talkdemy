import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Input} from '@/components/ui/input'
function Login(){
    return(<div className="h-screen flex flex-col">
    <div className=" flex flex-row w-full justify-center items-center py-4 border-b-2 border-[#A1ADB5] gap-2">
        <Boxes />
        <p className=" font-bold text-2xl">Talkdemy</p>
    </div>
    <div className="flex flex-col items-center h-full w-screen">
        <div className="my-20">
            <p className="text-4xl font-light">Welcome</p>
            <p className="text-xl font-extralight">Connect with the class in real time.</p>
        </div>
        <form action="tbd" method="get">
            <div className=" flex gap-6 flex-col">
                <Input type="email" placeholder="Email" className="h-9 w-96"></Input>
                <Input type="password" placeholder="Password" className="w-96 h-9"></Input>

                <Button className="w-96 h-9">Login</Button>
            </div>
        </form>
    </div>
    </div>);
}
//context or zustand

export default Login;