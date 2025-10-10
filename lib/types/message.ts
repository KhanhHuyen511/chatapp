import { ReactionTypes } from '../constant/reactions';
import { User } from './user';

export type Message = {
  id: string;
  content: string;
  attachments?: File[];
  createdAt: string;
  createdBy: User;
  reaction?: ReactionTypes;
};
