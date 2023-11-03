import { Roles } from "../enums";

export interface Message {
  id: string;
  role: Roles;
  content: string;
  type?: string;
}
