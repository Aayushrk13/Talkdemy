import type{Messagetype} from "./Message";
export interface Group {
  _id: string;
  name: string;
  members: string[];
  teacher_id: string;
}