import Navbar from "@/components/Navbar";
function Chat(){
    //use typescript types to form classes
    const classes_data = [
        "Math",
        "Business Environment",
        "IT Ethics"
    ]
    return(
        <div className="h-screen w-screen flex flex-col">
            <Navbar></Navbar>
            <div className="flex flex-row h-full w-full ">
                <div className="border-r-2 border-[#A1ADB5]">
                    <div className="flex flex-row items-center mb-5">
                        <p>Username</p>
                        <div>
                           <img src="@/assets/react.svg" alt="Profile picture" /> 
                        </div>
                    </div>
                    <p>Classes/Groups</p>
                    {classes_data.map(classes => <div>
                        <span>logo or smth</span>
                        <span>{classes}</span>
                    </div>)}
                </div>
                <div className="">
                    <div>
                        //chating interface
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;