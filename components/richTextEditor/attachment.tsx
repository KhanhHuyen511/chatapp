'use client';

import React, { FC, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { PaperclipIcon, XIcon } from 'lucide-react';
import Preview from './preview';
import { cn } from '@/lib/utils';

type Props = {
  file: File;
  index: number;
  handleRemoveFile?: (index: number) => void;
};

const Attachment: FC<Props> = ({ file, index, handleRemoveFile }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith('image')) {
      setImgSrc(URL.createObjectURL(file));
    }
  }, [file]);

  const allowPreview = () => {
    return (
      file.type.startsWith('image') ||
      file.type.startsWith('application/pdf') ||
      file.type.startsWith('text')
    );
  };

  return (
    <div
      key={file.name}
      className="inline-flex flex-col items-center justify-between bg-gray-100 rounded-md w-24 h-24 group relative"
    >
      {!imgSrc && (
        <div className="text-xs p-4 space-y-2 w-full overflow-hidden">
          <PaperclipIcon className="w-5 h-5 text-gray-500" />

          <div>
            <p className="truncate">{file.name}</p>
            <p className="text-xs text-gray-500 truncate">{file.size} KB</p>
          </div>
        </div>
      )}

      {imgSrc && (
        <img
          src={imgSrc}
          alt={file.name}
          className="flex-1 w-20 h-20 object-cover"
        />
      )}

      {allowPreview() && (
        <div
          className={cn(
            'hidden group-hover:flex absolute right-0',
            handleRemoveFile ? 'top-10' : 'top-0'
          )}
        >
          <Preview file={file} />
        </div>
      )}

      {handleRemoveFile && (
        <Button
          onClick={() => handleRemoveFile(index)}
          variant="destructive"
          size="icon"
          className="hidden group-hover:flex absolute top-0 right-0"
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
};

export default Attachment;
