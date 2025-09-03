import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MessageBox from "@/components/chat/messagebox";
import type{ Message } from "types/Message";
import React from "react";

interface ChatWindowProps {
  messages: Message[];
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  message,
  onMessageChange,
  onSend,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden ">
      {/* Messages List */}
      <div className="overflow-y-auto m-2 flex flex-col scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {messages.map((msg: Message, index: number) => (
          <MessageBox {...msg} key={index} />
        ))}
      </div>

      {/* Input Box */}
      <div className="w-full flex gap-6 p-4 border-t border-gray-300">
        <Input
          type="text"
          className="border-2 border-primary flex-1"
          placeholder="Type your message..."
          value={message}
          onChange={onMessageChange}
        />
        <Button onClick={onSend} disabled={disabled}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
