'use client';

import { useAuth } from '@/contexts/authContext';
import { User } from '@/lib/types/user';
import { cn } from '@/lib/utils';
import React, { FC } from 'react';
import Attachment from './richTextEditor/attachment';
import { markdownToHtml } from '@/lib/utils/markdown';

type Props = {
  content: string;
  attachments?: File[];
  createdAt: string;
  createdBy: User;
};

const Bubble: FC<Props> = ({ content, attachments, createdAt, createdBy }) => {
  const { user } = useAuth();

  return (
    <div
      className={cn(
        'rounded-md p-2 max-w-[80%]',
        user?.id === createdBy.id
          ? 'bg-blue-100 ml-auto'
          : 'bg-gray-100 mr-auto'
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
      <p className="text-sm text-gray-500">{createdAt}</p>
    </div>
  );
};

export default Bubble;
