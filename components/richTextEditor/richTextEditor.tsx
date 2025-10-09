'use client';

import React, { FC, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { useChat } from '@/contexts/chatContext';
import Toolbar from './toolbar';
import { XIcon } from 'lucide-react';
import Attachment from './attachment';

type Props = {
  className?: string;
};

const RichTextEditor: FC<Props> = ({ className }) => {
  const { addMessage } = useChat();

  const [input, setInput] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleSend = (message: string) => {
    addMessage({
      id: crypto.randomUUID(),
      content: message,
      createdAt: new Date().toISOString(),
      createdBy: { id: '1', name: 'User A' },
      attachments: attachedFiles,
    });

    handleReset();
  };

  const handleReset = () => {
    setInput('');
    setAttachedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFileAttach = (attachedFiles: FileList) => {
    setAttachedFiles((prev) => [...prev, ...Array.from(attachedFiles)]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <div className="border p-4 rounded-md space-y-2">
        {/* Toolbar */}
        <Toolbar
          execCommand={execCommand}
          handleFileAttach={handleFileAttach}
          fileInputRef={fileInputRef}
        />

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[100px] max-h-[200px] overflow-y-auto outline-none focus:ring-0"
          style={{ whiteSpace: 'pre-wrap' }}
          onInput={(e) => setInput(e.currentTarget.innerHTML)}
          data-placeholder="Type your message here"
        />

        {/* Attached Files */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <Attachment
                key={file.name}
                file={file}
                index={index}
                handleRemoveFile={handleRemoveFile}
              />
            ))}
          </div>
        )}

        <Button onClick={() => handleSend(input)}>Send</Button>
      </div>
    </div>
  );
};

export default RichTextEditor;
