'use client';

import {
  createMessage,
  deleteAllMessages,
  getMessages,
  editMessage as editMessageAction,
  deleteMessage as deleteMessageAction,
} from '@/actions/messages';
import { ReactionTypes } from '@/lib/constant/reactions';
import { CreateMessageParams, Message } from '@/lib/types/message';
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types/user';

type ChatContextType = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message, user: User) => void;
  editMessage: (message: Message) => void;
  editingMessage: Message | null;
  setEditingMessage: (message: Message | null) => void;
  deleteMessage: (id: string) => void;
  addReaction: (message: Message, reaction?: ReactionTypes) => void;
  clearMessages: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  useEffect(() => {
    getMessages().then((messages) => {
      setMessages(messages);
    });
  }, []);

  const addMessage = (message: CreateMessageParams, user: User) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: message.content,
      attachments: message.attachments,
      createdAt: new Date().toISOString(),
      createdBy: user,
    };

    setMessages((prev) => [...prev, newMessage]);
    createMessage(newMessage, user.id);
  };

  const editMessage = (message: Message) => {
    const { id } = message;
    setMessages((prev) => prev.map((m) => (m.id === id ? message : m)));
    setEditingMessage(null);
    editMessageAction(message);
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    deleteMessageAction(id);
  };

  const addReaction = (message: Message, reaction?: ReactionTypes) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === message.id ? { ...m, reaction: reaction || undefined } : m
      )
    );

    editMessageAction({ ...message, reaction: reaction || undefined });
  };

  const clearMessages = () => {
    setMessages([]);
    deleteAllMessages();
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        addMessage,
        editMessage,
        deleteMessage,
        editingMessage,
        setEditingMessage,
        addReaction,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
