import React, {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import type { User } from "types/User";
import { getclasses } from "@/api";
import type { Group } from "types/Group";

const GroupContext = createContext<{
	groups: Group[];
	getgroups: (id: User["_id"]) => Promise<void>;
	updateGroups:(group:Group)=>void;
}>({
	groups: [],
	getgroups: async () => {},
	updateGroups:()=>{},
});

const useGroup = () => {
	const cxt = useContext(GroupContext);
	if (!cxt) throw new Error("useGroup must be used inside a provider");
	return cxt;
};

const GroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [groups, setgroups] = useState<Group[]>([]);

	const getgroups = async (id: User["_id"]) => {
		try {
			if (id === "") throw new Error("No User is logged in");
			const response = await getclasses(id);
			setgroups(response.data.data);
		} catch (e) {
			console.log(e);
		}
	};

	const updateGroups = (group:Group)=>{
		setgroups(prevGroups=>{
			return {
				...prevGroups,
				group
			}
		})
	}

	const value = useMemo(() => ({ groups, getgroups,updateGroups }), [groups]);

	return (
		<GroupContext.Provider value={value}>{children}</GroupContext.Provider>
	);
};

export { GroupProvider, useGroup };
