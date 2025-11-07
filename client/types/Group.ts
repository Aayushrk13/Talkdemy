import type{Message} from "./Message";
export interface Group {
  _id: string;
  name: string;
  members: string[];
  teacher_id: string;
  messages: Message[] | null;
}