'use client';

import React, { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { EyeIcon } from 'lucide-react';
import { Button } from '../ui/button';

type Props = {
  file: File;
};

enum FileType {
  IMAGE = 'image',
  PDF = 'application/pdf',
  TEXT = 'text',
}

const getFileType = (type: string) => {
  if (type.startsWith('image')) {
    return FileType.IMAGE;
  } else if (type.startsWith('application/pdf')) {
    return FileType.PDF;
  } else if (type.startsWith('text')) {
    return FileType.TEXT;
  }
};

const Preview: FC<Props> = ({ file }) => {
  const renderContent = () => {
    const fileType = getFileType(file.type);
    switch (fileType) {
      case FileType.IMAGE:
        return (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="max-w-full object-contain mx-auto"
          />
        );
      case FileType.PDF:
        return (
          <iframe src={URL.createObjectURL(file)} className="w-full h-full" />
        );
      case FileType.TEXT:
        return (
          <iframe src={URL.createObjectURL(file)} className="w-full h-full" />
        );
      default:
        return <div>Unsupported file type</div>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <EyeIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[90dvw] min-h-[90dvh] w-[90dvw] h-[90dvh] flex flex-col bg-gray-100">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <div className="flex-1">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Preview;
