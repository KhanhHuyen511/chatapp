'use client';

import Bubble from '@/components/bubble';
import RichTextEditor from '@/components/richTextEditor/richTextEditor';
import { ChatProvider, useChat } from '@/contexts/chatContext';

export default function Home() {
  const { messages } = useChat();

  return (
    <div className="w-2xl mx-auto space-y-4 h-screen flex flex-col">
      <div className="sticky top-0 left-0 right-0 border-b bg-white p-4">
        <h1 className="text-2xl font-bold">Chat App</h1>

        <div>
          <p>User A</p>
          <p>Online</p>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto flex flex-col gap-2">
        {messages.map((message) => (
          <Bubble
            key={message.id}
            content={message.content}
            attachments={message.attachments}
            createdAt={message.createdAt}
            createdBy={message.createdBy}
          />
        ))}
      </ul>

      {/* Editor */}
      <RichTextEditor className="py-4" />
    </div>
  );
}
