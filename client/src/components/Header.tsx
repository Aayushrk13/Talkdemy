import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex flex-row w-full justify-between items-center py-4 px-8 border-b-2 border-brand-border">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <Boxes className="text-brand-accent" />
        <p className="font-bold text-2xl">Talkdemy</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/login")}
          className="font-light"
        >
          Login
        </Button>
        <Button 
          onClick={() => navigate("/signup")}
          className="font-medium"
        >
          Get Started
        </Button>
      </div>
    </header>
  );
};
