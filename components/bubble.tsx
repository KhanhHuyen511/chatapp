'use client';

import { useAuth } from '@/contexts/authContext';
import { User } from '@/lib/types/user';
import { cn } from '@/lib/utils';
import React, { FC } from 'react';

type Props = {
  content: string;
  createdAt: string;
  createdBy: User;
};

const Bubble: FC<Props> = ({ content, createdAt, createdBy }) => {
  const { user } = useAuth();

  return (
    <div
      className={cn(
        'rounded-md p-2',
        user?.id === createdBy.id
          ? 'bg-blue-100 ml-auto'
          : 'bg-gray-100 mr-auto'
      )}
    >
      <p>{content}</p>
      <p className="text-sm text-gray-500">{createdAt}</p>
    </div>
  );
};

export default Bubble;
