'use client';

import { useAuth } from '@/contexts/authContext';
import { User } from '@/lib/types/user';
import { cn } from '@/lib/utils';
import React, { FC } from 'react';
import Attachment from './attachment';
import { markdownToHtml } from '@/lib/utils/markdown';
import dayjs from 'dayjs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Props = {
  content: string;
  attachments?: File[];
  createdAt: string;
  createdBy: User;
};

const Bubble: FC<Props> = ({ content, attachments, createdAt, createdBy }) => {
  const { user } = useAuth();

  return (
    <div className="flex items-start gap-2">
      {user?.id !== createdBy.id && (
        <Avatar>
          <AvatarFallback>{createdBy.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[80%] space-y-1 group',
          user?.id === createdBy.id ? 'ml-auto' : 'mr-auto'
        )}
      >
        <div
          className={cn(
            'rounded-md p-2',
            user?.id === createdBy.id ? 'bg-blue-100' : 'bg-gray-100'
          )}
        >
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
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
      </div>
    </div>
  );
};

export default Bubble;
