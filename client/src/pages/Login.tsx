import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Input} from '@/components/ui/input'
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login(){
    const navigate = useNavigate();
    useEffect(()=>{
        axios.get("http://localhost:8000/login",{withCredentials:true})
        .then((res)=>{
            if(res.data){
                console.log(res.data);
                navigate("/chat") //use context fro user data and state management
            }
        })
        .catch((err)=>{
            console.log(err.data);
        })
    },[])
    const [email,setemail] = useState<string>("");
    const [password,setpassword] = useState<string>("");
    const handlesubmit = ()=>{
        axios.post("http://localhost:8000/user/login",{email:email,password:password},{withCredentials:true})
        .then(response=>handleresponse(response.data))
        .catch(err=>{console.log(err.response.data)}) 
    }
    const handleresponse = (res_data : any)=>{
        if (res_data){
            console.log(res_data);
            navigate("/chat")
        }else{
            console.log("not found suer");
        }
    }
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
            <div className=" flex gap-6 flex-col">
                <Input type="email" placeholder="Email" className="h-9 w-96" name="email" required onChange={(e)=>{
                    setemail(e.target.value);
                }}></Input>
                <Input type="password" placeholder="Password" className="w-96 h-9" name="password" required onChange={(e)=>{
                    setpassword(e.target.value)
                }}></Input>
                <Button className="w-96 h-9" onClick={handlesubmit}>Login</Button>
            </div>
    </div>
    </div>);
}
//context or zustand

export default Login;