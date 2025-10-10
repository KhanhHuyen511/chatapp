'use client';

import { Message } from '@/lib/types/message';
import { createContext, useContext, useState } from 'react';

type ChatContextType = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  editMessage: (message: Message) => void;
  editingMessage: Message | null;
  setEditingMessage: (message: Message | null) => void;
  deleteMessage: (id: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);

    // TODO: Replace with actual chat logic
    setTimeout(() => {
      const replyMessage: Message = {
        id: crypto.randomUUID(),
        content: 'Hello, how are you?',
        createdAt: new Date().toISOString(),
        createdBy: { id: '2', name: 'User B' },
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 300);
  };

  const editMessage = (message: Message) => {
    const { id } = message;
    setMessages((prev) => prev.map((m) => (m.id === id ? message : m)));
    setEditingMessage(null);
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
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
