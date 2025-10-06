import { createContext, useContext, useState, type ReactNode } from "react";

export const PageContext = createContext<{
  page: number;
  hasMorepages : boolean;
  togglehasMorepages : ()=> void;
  getmorePages: () => void;
  resetPage : ()=> void;
}>({ page: 1,hasMorepages:true, getmorePages: () => {}, resetPage: ()=>{},togglehasMorepages :()=>{}},);

export const usePage = ()=>{
    const pagecon = useContext(PageContext);
    if(!pagecon) throw new Error("usePage must be inside of page provider")
    return pagecon;
}

export const PageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [page, setpage] = useState<number>(1);
  const [hasMorepages,sethasMorepages] = useState<boolean>(true);
  const togglehasMorepages = ()=>{
    sethasMorepages(!hasMorepages);
  }
  const resetPage = ()=>{
    setpage(1);
  }

  const getmorePages = () => {
    setpage(page + 1);
  };

  return (
    <PageContext.Provider value={{ page, getmorePages, resetPage,hasMorepages,togglehasMorepages }}>
      {children}
    </PageContext.Provider>
  );
};
