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
  group: Group[];
  getgroup: (id: User["_id"]) => Promise<void>;
}>({
  group: [],
  getgroup: async () => {},
});

const useGroup = () => {
  const cxt = useContext(GroupContext);
  if (!cxt) throw new Error("useGroup must be used inside a provider");
  return cxt;
};

const GroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [group, setgroup] = useState<Group[]>([]);
  const getgroup = async (id: User["_id"]) => {
    if (id === "") throw new Error("No User is logged in");
    try {
      const response = await getclasses(id);
      setgroup(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <GroupContext.Provider value={{ group, getgroup }}>
      {children}
    </GroupContext.Provider>
  );
};

export { GroupProvider, useGroup };
