import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input"
import MessageBox from "@/components/chat/messagebox"
import type {Message} from "../../types/Message"
import type {User} from "../../types/User"
function Chat(){
    //use typescript types to form classes
    const classes_data:string[] = [
        "Math",
        "Businessdsfasdlfasdfskjfhaksdfhkasjdfhaksjdfhkahf Environment",
        "IT Ethics"
    ]
    const dummy_user:User = {
        user_id : "111",
        name : "Aayush Rajkarnikar",
        email : "123@gmail.com",
        role : "student"
    }

    const dummy_message:Message = {
        messageid : "101",
        messagecontent : "This is dumy",
        User : dummy_user
    }
    const [message,setmessage] = useState<string>("")
    const [messages,setmessages] = useState<Message[]>([])
    const handleinputchange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setmessage(e.target.value);
    }
    const handlebuttonclick = ()=>{
        let messageobj = {
            messageid:"101",
            User : dummy_user,
            messagecontent : message
        }
        setmessages([...messages,messageobj])
        setmessage("")
    }

    return(
        <div className="h-screen w-screen flex flex-col">
            <Navbar></Navbar>
            <div className="flex flex-row flex-1 overflow-hidden ">
                <div className="border-r-2 border-[#A1ADB5] w-1/5 overflow-hidden">
                    <div className="flex flex-row items-center mb-5">
                        <p>Username</p>
                        <div>
                           <img src="@/assets/react.svg" alt="Profile picture" /> 
                        </div>
                    </div>
                    <p>Classes/Groups</p>
                    {classes_data.map(classes => <div key={classes_data.indexOf(classes)} className="mb-2 ">
                        <span>logo or smth</span>
                        <span>{classes}</span>
                    </div>)}
                </div>
                <div className="flex flex-col flex-1 min-h-0 overflow-hidden ">
                    <div className="overflow-y-auto flex-1 m-2">
                        {messages.map((msg:Message)=>{
                            return <MessageBox {...msg}/>
                        })}
                        <MessageBox {...dummy_message} />
                    </div>
                    <div className="w-full flex gap-6 p-4 border-t border-gray-300">
                            <Input type="text" className="border-2 border-primary flex-1" placeholder="Type your message..." value={message} onChange={handleinputchange}/>
                            <Button onClick={handlebuttonclick}>Send</Button>
                    </div>
                </div>
            </div>
        </div>);
}

export default Chat;