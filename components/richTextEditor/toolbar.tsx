import React, { FC, useRef } from 'react';
import { Button } from '../ui/button';

const ToolbarButton = ({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) => {
  return (
    <Button onClick={onClick} variant="ghost" title={title}>
      {children}
    </Button>
  );
};

type Props = {
  execCommand: (command: string, value?: string) => void;
  handleFileAttach: (attachedFiles: FileList) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

const Toolbar: FC<Props> = ({
  execCommand,
  handleFileAttach,
  fileInputRef,
}) => {
  return (
    <div>
      <div className="flex gap-2 border-b">
        <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
          Bold
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
          Italic
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('strikeThrough')}
          title="Strikethrough"
        >
          Strikethrough
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) {
              execCommand('createLink', url);
            }
          }}
          title="Link"
        >
          Link
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('insertUnorderedList')}
          title="Unordered List"
        >
          Unordered List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('insertOrderedList')}
          title="Ordered List"
        >
          Ordered List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('justifyCenter')}
          title="Alignment"
        >
          Align Center
        </ToolbarButton>
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Attach File"
        >
          Attach File
        </ToolbarButton>
        {/* <ToolbarButton onClick={codeCommand} title="Code">
          Code
        </ToolbarButton> */}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            handleFileAttach(e.target.files);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default Toolbar;
