'use client';

import React, { FC, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useChat } from '@/contexts/chatContext';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

const RichTextEditor: FC<Props> = ({ className }) => {
  const { addMessage } = useChat();

  const [input, setInput] = useState('');

  const handleSend = (message: string) => {
    addMessage({
      id: crypto.randomUUID(),
      content: message,
      createdAt: new Date().toISOString(),
      createdBy: { id: '1', name: 'User A' },
    });
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <Input
        type="text"
        placeholder="Message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button onClick={() => handleSend(input)}>Send</Button>
    </div>
  );
};

export default RichTextEditor;
