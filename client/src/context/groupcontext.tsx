import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { User } from "types/User";
import { getclasses } from "@/api";
import type{Group} from "types/Group";

const GroupContext = createContext<{
  groups: Group[];
  getgroups: (id: User["_id"]) => Promise<void>;

}>({
  groups: [],
  getgroups: async () => {},
});

const useGroup = () => {
  const cxt = useContext(GroupContext);
  if (!cxt) throw new Error("useGroup must be used inside a provider");
  return cxt;
};

const GroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groups, setgroups] = useState<Group[]>([]);
  const getgroups = async (id: User["_id"]) => {
    if (id === "") throw new Error("No User is logged in");
    try {
      const response = await getclasses(id);
      setgroups(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <GroupContext.Provider value={{ groups, getgroups }}>
      {children}
    </GroupContext.Provider>
  );
};

export { GroupProvider, useGroup };
