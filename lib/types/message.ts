import { User } from './user';

export type Message = {
  id: string;
  content: string;
  createdAt: string;
  createdBy: User;
};
