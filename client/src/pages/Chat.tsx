import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input"
import { useUser } from "@/context/usercontext";
import MessageBox from "@/components/chat/messagebox"
import type {Message} from "../../types/Message"
function Chat(){
    const userContext = useUser();
    useEffect(()=>{
        userContext.loginByToken()
    },[])
    //use typescript types to form classes
    const classes_data:string[] = [  //collect classes data from db
        "Math",
        "Businessdsfasdlfasdfskjfhaksdfhkasjdfhaksjdfhkahf Environment",
        "IT Ethics"
    ];
    const [message,setmessage] = useState<string>("")
    const [messages,setmessages] = useState<Message[]>([{
        messagecontent:"dummy",
        messageid : "102",
        User :null
    }])
    const handleinputchange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setmessage(e.target.value);
    }
    const handlebuttonclick = ()=>{
        let messageobj = {
            messageid:"101",
            User : userContext.user,
            messagecontent : message
        }
        setmessages([...messages,messageobj])
        setmessage("")
        console.log(userContext.user);
    }

    return(
        <div className="h-screen w-screen flex flex-col">
            <Navbar></Navbar>
            <div className="flex flex-row flex-1 overflow-hidden ">
                <div className="border-r-2 border-[#A1ADB5] w-1/5 overflow-hidden">
                    <div className="flex flex-row items-center mb-5">
                        <div>
                           <img src="@/assets/react.svg" alt="Profile picture" /> 
                        </div>
                        {userContext.user?.name}
                    </div>
                    <p>Classes/Groups</p>
                    {classes_data.map(classes => <div key={classes_data.indexOf(classes)} className="mb-2 flex">
                        <div>logo </div>
                        <div className="ml-1 truncate">{classes}</div>
                    </div>)}
                </div>
                <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden ">
                    <div className="overflow-y-auto m-2 flex flex-col scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        {messages.map((msg:Message)=>{
                            return <MessageBox {...msg} key={messages.indexOf(msg)}/>
                        })}
                    </div>
                    <div className="w-full flex gap-6 p-4 border-t border-gray-300">
                            <Input type="text" className="border-2 border-primary flex-1" placeholder="Type your message..." value={message} onChange={handleinputchange}/>
                            <Button onClick={handlebuttonclick} disabled={!message}>Send</Button>
                    </div>
                </div>
                <div className="border-l-2 border-[#A1ADB5] w-1/4 overflow-hidden">
                    <h1>Class details</h1>
                    <p>class name</p> 
                    <p>members</p> 
                    <p>files???</p>
                </div>
            </div>
        </div>);
}

export default Chat;