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
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
} from 'lucide-react';
import { Separator } from '../ui/separator';

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
  insertAlignment: (alignment: 'left' | 'center' | 'right' | 'justify') => void;
};

const Toolbar: FC<Props> = ({
  onInsertFormatting,
  handleFileAttach,
  fileInputRef,
  insertList,
  insertAlignment,
}) => {
  return (
    <div>
      <div className="flex items-center gap-1 pb-1 border-b overflow-x-auto">
        {/* Formatting */}
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

        <Separator orientation="vertical" className="!h-5" />

        {/* List */}
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

        <Separator orientation="vertical" className="!h-5" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => insertAlignment('left')}
          title="Align Left"
        >
          <AlignLeftIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertAlignment('center')}
          title="Align Center"
        >
          <AlignCenterIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertAlignment('right')}
          title="Align Right"
        >
          <AlignRightIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertAlignment('justify')}
          title="Justify"
        >
          <AlignJustifyIcon />
        </ToolbarButton>

        <Separator orientation="vertical" className="!h-5" />

        {/* Code */}
        <ToolbarButton
          onClick={() => onInsertFormatting('`', '`')}
          title="Code"
        >
          <CodeIcon />
        </ToolbarButton>

        {/* Attach File */}
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
        accept="image/*,application/*,text/*"
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
