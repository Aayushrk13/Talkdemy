import type { User } from "types/User";

function NameBox({user}:any){
    return(<>
          <div
            onClick={() => console.log("hit")}
            className="px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition truncate"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-xs font-semibold">
              {user.name[0].toUpperCase()}
            </div>
            <span className="truncate">{user.name}</span>
            <span className="truncate">({user.email})</span>
          </div>
    </>);
}

export default NameBox;