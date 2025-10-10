import { User } from '@/lib/types/user';
import { getUserById } from './users';
import { CreateMessageParams, Message } from '@/lib/types/message';
import { ReactionTypes } from '@/lib/constant/reactions';

export const getMessages = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/messages`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const jsonMessages = await response.json();

    const messages = await Promise.all(
      jsonMessages.map(async (message: any) => {
        const user = await getUserById(message.createdBy);
        const attachments = message.attachments?.split(',');

        return {
          ...message,
          attachments,
          createdBy: user as User,
        };
      })
    );

    return messages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createMessage = async (
  message: CreateMessageParams,
  createdBy: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
    {
      method: 'POST',
      body: JSON.stringify({
        ...message,
        attachments: message.attachments?.map((attachment) => attachment.name),
        createdBy,
        createdAt: new Date().toISOString(),
      }),
    }
  );

  return response.json() as Promise<Message>;
};

export const editMessage = async (message: Message) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
    {
      method: 'PUT',
      body: JSON.stringify(message),
    }
  );

  return response.json() as Promise<Message>;
};

export const deleteMessage = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
    {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }
  );

  return response.json() as Promise<Message>;
};

export const deleteAllMessages = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
    {
      method: 'DELETE',
      body: JSON.stringify({ id: 'all' }),
    }
  );

  return response.json() as Promise<Message>;
};
