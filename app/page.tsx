'use client';

import Bubble from '@/components/richTextEditor/bubble';
import RichTextEditor from '@/components/richTextEditor/richTextEditor';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChat } from '@/contexts/chatContext';
import { useEffect, useRef } from 'react';

export default function Home() {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 h-screen flex flex-col">
      <div className="sticky top-0 left-0 right-0 border-b bg-white p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback className="bg-blue-200">A</AvatarFallback>
          </Avatar>
          <p className="text-sm font-bold">User A</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col">
        <ul className="flex-1 overflow-y-auto flex flex-col gap-2">
          {messages.map((message) => (
            <Bubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </ul>

        {/* Editor */}
        <RichTextEditor className="py-4" />
      </div>
    </div>
  );
}
