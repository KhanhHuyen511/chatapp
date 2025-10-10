import React, { useRef, useState } from 'react';

type UseFileAttachmentsReturn = {
  attachedFiles: File[];
  setAttachedFiles: (files: File[]) => void;
  handleFileAttach: (files: File[]) => void;
  handleFileAttachFromList: (attachedFiles: FileList) => void;
  handleRemoveFile: (index: number) => void;
  resetAttachments: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isAttachmentsEmpty: () => boolean;
};

export const useFileAttachments = (): UseFileAttachmentsReturn => {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAttach = (files: File[]) => {
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const handleFileAttachFromList = (attachedFiles: FileList) => {
    setAttachedFiles((prev) => [...prev, ...Array.from(attachedFiles)]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetAttachments = () => {
    setAttachedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isAttachmentsEmpty = () => {
    return attachedFiles.length === 0;
  };

  return {
    attachedFiles,
    setAttachedFiles,
    handleFileAttach,
    handleFileAttachFromList,
    handleRemoveFile,
    resetAttachments,
    fileInputRef,
    isAttachmentsEmpty,
  };
};
