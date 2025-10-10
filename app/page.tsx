'use client';

import Bubble from '@/components/richTextEditor/bubble';
import RichTextEditor from '@/components/richTextEditor/richTextEditor';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/authContext';
import { useChat } from '@/contexts/chatContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Home() {
  const { messages, clearMessages } = useChat();
  const { user } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user]);

  return (
    user &&
    user.name && (
      <div className="w-full max-w-2xl mx-auto space-y-4 h-screen flex flex-col bg-background">
        <div className="sticky top-0 left-0 right-0 border-b bg-white p-4 lg:px-8 z-10">
          <div className="flex items-center gap-2">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary text-primary-foreground uppercase">
                {user.name.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-bold">{user.name}</p>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => {
                clearMessages();
              }}
            >
              Clear Chat
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-8 flex flex-col bg-background">
          <ul className="flex-1 flex flex-col gap-2 pb-8">
            {messages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </ul>

          {/* Editor */}
          <div className="z-10 sticky bottom-0 left-0 right-0 bg-background">
            <RichTextEditor />
          </div>
        </div>
      </div>
    )
  );
}
