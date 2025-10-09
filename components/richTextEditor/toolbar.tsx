import React, { FC, useRef } from 'react';
import { Button } from '../ui/button';
import {
  BoldIcon,
  ListIcon,
  ListOrderedIcon,
  CodeIcon,
  FileIcon,
  LinkIcon,
  StrikethroughIcon,
  ItalicIcon,
} from 'lucide-react';

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
    <Button onClick={onClick} variant="ghost" size="icon" title={title}>
      {children}
    </Button>
  );
};

type Props = {
  onInsertFormatting: (before: string, after: string) => void;
  handleFileAttach: (attachedFiles: FileList) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  insertList: (type: 'ordered' | 'unordered') => void;
};

const Toolbar: FC<Props> = ({
  onInsertFormatting,
  handleFileAttach,
  fileInputRef,
  insertList,
}) => {
  return (
    <div>
      <div className="flex gap-2 border-b">
        <ToolbarButton
          onClick={() => onInsertFormatting('**', '**')}
          title="Bold"
        >
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onInsertFormatting('*', '*')}
          title="Italic"
        >
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onInsertFormatting('~~', '~~')}
          title="Strikethrough"
        >
          <StrikethroughIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) {
              onInsertFormatting('[', `](${url})`);
            }
          }}
          title="Link"
        >
          <LinkIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertList('unordered')}
          title="Unordered List"
        >
          <ListIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertList('ordered')}
          title="Ordered List"
        >
          <ListOrderedIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onInsertFormatting('`', '`')}
          title="Code"
        >
          <CodeIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Attach File"
        >
          <FileIcon />
        </ToolbarButton>
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
