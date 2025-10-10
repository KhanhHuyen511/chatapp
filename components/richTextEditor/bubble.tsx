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
import {
  FrownIcon,
  HeartIcon,
  LaughIcon,
  MessageCircleHeartIcon,
  PencilIcon,
  ThumbsUpIcon,
  XIcon,
} from 'lucide-react';
import { useChat } from '@/contexts/chatContext';
import { Message } from '@/lib/types/message';
import RichTextEditor from './richTextEditor';
import { Separator } from '../ui/separator';
import Reactions from './reactions';
import { renderReaction } from '@/lib/utils/reactions';

type Props = {
  message: Message;
};

const Bubble: FC<Props> = ({ message }) => {
  const { id, content, attachments, createdAt, createdBy, reaction } = message;
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
        <p className="text-xs text-gray-500 group-[.ml-auto]:text-right group-[.mr-auto]:text-left">
          {dayjs(createdAt).format('HH:mm')}
        </p>

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

        {reaction && (
          <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow p-0.25 absolute -bottom-4 left-0">
            {renderReaction(reaction)}
          </div>
        )}

        <div
          className={cn(
            'z-10 items-center gap-1 bg-white rounded-md shadow p-1 absolute -bottom-10 hidden group-hover:flex',
            isMyMessage ? 'right-0' : 'left-0'
          )}
        >
          {/* Reactions */}
          <Reactions messageId={id} reaction={reaction} />

          {/* Edit and delete message */}
          {isMyMessage && (
            <>
              <Separator orientation="vertical" className="!h-5" />

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setEditingMessage(message);
                }}
              >
                <PencilIcon />
              </Button>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => deleteMessage(id)}
              >
                <XIcon />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bubble;
