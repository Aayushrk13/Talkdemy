import type { Group } from "types/Group";

interface GroupListProps {
  groups: Group[];
  onGroupClick: (index: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onGroupClick }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-3">
        Classes / Groups
      </p>
      <div className="space-y-1">
        {groups.map((group, index) => (
          <div
            key={group._id}
            onClick={() => onGroupClick(index)}
            className="px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition truncate"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-xs font-semibold">
              {group.name?.[0].toUpperCase()}
            </div>
            <span className="truncate">{group.name}</span>
          </div>
        ))}
      </div>
        {/* {groups.filter(group =>group.type == 'direct').map((group, index) => (
          <div
            key={group._id}
            onclick={() => ongroupclick(index)}
            classname="px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition truncate"
          >
            <div classname="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-xs font-semibold">
              {group.name?.[0].touppercase()} //use the receiver's name
            </div>
            <span classname="truncate">{group.name}</span> //use the receiver's name
          </div>
        ))} */}
    </div>
  );
};

export default GroupList;
