import { Boxes } from "lucide-react";
function Navbar(){
    return(<>
        <div className=" flex flex-row h-10 w-full justify-between items-center py-6 border-b-2 border-[#A1ADB5] mb-4">
            <div className=" flex flex-row items-center justify-between ml-8">
                <Boxes />
                <p className=" font-bold text-2xl">Talkdemy</p>
            </div>
            <div className=" flex flex-row w-1/3 justify-around mr-8">
                <p>Home</p>
                <p>Features</p>
                <p>Contact</p>
            </div>    
        </div> 
    </>);
}

export default Navbar;