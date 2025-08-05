import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input"
function Chat(){
    //use typescript types to form classes
    const classes_data:string[] = [
        "Math",
        "Businessdsfasdlfasdfskjfhaksdfhkasjdfhaksjdfhkahf Environment",
        "IT Ethics"
    ]

    const [message,setmessage] = useState<string>("")
    const handleinputchange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setmessage(e.target.value);
    }
    const handlebuttonclick = ()=>{
        console.log(message);
        setmessage("")
    }

// return (
//     <div className="h-screen w-screen flex flex-col ">
//       <Navbar />
//       {/* Main layout */}
//       <div className="flex flex-row flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <div className="w-64 border-r-2 border-[#A1ADB5] p-4 overflow-hidden">
//           <div className="flex flex-row items-center mb-5">
//             <p className="mr-2">Username</p>
//             <div className="w-8 h-8">
//               <img
//                 src="@/assets/react.svg"
//                 alt="Profile picture"
//                 className="w-full h-full object-cover rounded-full"
//               />
//             </div>
//           </div>
//           <p className="mb-2">Classes/Groups</p>
//           {classes_data.map((classes, i) => (
//             <div key={i} className="mb-2 flex items-center gap-2">
//               <span>📘</span>
//               <span>{classes}</span>
//             </div>
//           ))}
//         </div>

//         {/* Chat Area */}
//         <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
//           {/* Message display section */}
//           <div className="flex-1 overflow-y-auto bg-red-500 m-2">
//             {/* Chatting interface goes here */}
//           </div>

//           {/* Message input */}
//           <div className="w-full flex gap-4 p-4 border-t border-gray-300">
//             <Input
//               type="text"
//               className="border-2 border-primary flex-1"
//               placeholder="Type your message..."
//               value={message}
//               onChange={handleinputchange}
//             />
//             <Button onClick={handlebuttonclick}>Send</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

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
                    <div className="bg-amber-300 overflow-y-auto flex-1 m-2">
                        {/*Chatting interface */}
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