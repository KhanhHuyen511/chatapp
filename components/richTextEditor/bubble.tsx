'use client';

import { useAuth } from '@/contexts/authContext';
import { User } from '@/lib/types/user';
import { cn } from '@/lib/utils';
import React, { FC } from 'react';
import Attachment from './attachment';
import { markdownToHtml } from '@/lib/utils/markdown';
import dayjs from 'dayjs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { PencilIcon, XIcon } from 'lucide-react';
import { useChat } from '@/contexts/chatContext';
import { Message } from '@/lib/types/message';
import RichTextEditor from './richTextEditor';

type Props = {
  message: Message;
};

const Bubble: FC<Props> = ({ message }) => {
  const { id, content, attachments, createdAt, createdBy } = message;
  const { user } = useAuth();
  const { editMessage, deleteMessage, editingMessage, setEditingMessage } =
    useChat();

  const isMyMessage = user?.id === createdBy.id;

  return (
    <div className="flex items-start gap-2">
      {!isMyMessage && (
        <Avatar>
          <AvatarFallback>{createdBy.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[80%] space-y-1 group relative',
          user?.id === createdBy.id ? 'ml-auto' : 'mr-auto'
        )}
      >
        <div
          className={cn(
            'rounded-md p-2',
            user?.id === createdBy.id ? 'bg-blue-100' : 'bg-gray-100'
          )}
        >
          {/* Content */}
          <div
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
            style={{ wordBreak: 'break-word' }}
          />

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <Attachment key={file.name} file={file} index={index} />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 group-[.ml-auto]:text-right group-[.mr-auto]:text-left">
          {dayjs(createdAt).format('HH:mm')}
        </p>

        {/* Edit and delete message */}
        {isMyMessage && (
          <div className="items-center gap-1 bg-white rounded-md shadow p-1 absolute -bottom-5 right-0 hidden group-hover:flex">
            <Button
              variant="destructive"
              size="icon-sm"
              onClick={() => deleteMessage(id)}
            >
              <XIcon />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setEditingMessage(message);
              }}
            >
              <PencilIcon />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bubble;
