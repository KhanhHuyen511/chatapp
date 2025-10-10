'use client';

import React, { FC, useEffect } from 'react';
import { Button } from '../ui/button';
import { useChat } from '@/contexts/chatContext';
import Toolbar from './toolbar';
import Attachment from './attachment';
import { markdownToHtml } from '@/lib/utils/markdown';
import { Message } from '@/lib/types/message';
import { useTextEditor } from '@/hooks/useTextEditor';
import { useFileAttachments } from '@/hooks/useFileAttachments';
import { usePreview } from '@/hooks/usePreview';

type Props = {
  className?: string;
};

const RichTextEditor: FC<Props> = ({ className }) => {
  const { addMessage, editingMessage, editMessage, setEditingMessage } =
    useChat();

  const {
    attachedFiles,
    setAttachedFiles,
    handleFileAttach,
    handleFileAttachFromList,
    handleRemoveFile,
    resetAttachments,
    fileInputRef,
    isAttachmentsEmpty,
  } = useFileAttachments();

  const { isPreview, handleTurnOnPreview, handleTurnOffPreview, resetPreview } =
    usePreview();

  const handleSend = (message: string) => {
    if (isInputEmpty() && isAttachmentsEmpty()) return;

    if (editingMessage) {
      editMessage({
        ...editingMessage,
        content: message,
        attachments: attachedFiles,
      });
    } else {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        content: message,
        createdAt: new Date().toISOString(),
        createdBy: { id: '1', name: 'User A' },
        attachments: attachedFiles,
      };

      addMessage(newMessage);
    }

    handleReset();
  };

  const {
    input,
    setInput,
    editorRef,
    insertFormatting,
    insertList,
    insertAlignment,
    handleInput,
    handleKeyDown,
    handlePaste,
    isInputEmpty,
    resetTextEditor,
  } = useTextEditor({
    onSend: handleSend,
    onFileAttach: handleFileAttach,
  });

  // Set input and attached files when editing message
  useEffect(() => {
    if (editingMessage) {
      setInput(editingMessage.content);
      setAttachedFiles(editingMessage.attachments || []);
    }
  }, [editingMessage]);

  const handleReset = () => {
    resetTextEditor();
    resetAttachments();
    resetPreview();
  };

  const handleCancelEditing = () => {
    setEditingMessage(null);
    resetTextEditor();
    resetAttachments();
    resetPreview();
    editorRef.current?.focus();
  };

  return (
    <div className={className}>
      <div className="border px-4 pb-4 pt-2 rounded-xl space-y-2">
        {/* Toolbar */}
        <Toolbar
          onInsertFormatting={insertFormatting}
          handleFileAttach={handleFileAttachFromList}
          fileInputRef={fileInputRef}
          insertList={insertList}
          insertAlignment={insertAlignment}
        />

        {/* Editor */}
        {!isPreview && (
          <textarea
            ref={editorRef}
            className="h-[100px] w-full overflow-y-auto outline-none focus:ring-0 resize-none"
            style={{ whiteSpace: 'pre-wrap' }}
            value={input}
            onChange={handleInput}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            disabled={isPreview}
            data-placeholder="Type your message here"
          />
        )}

        {isPreview && (
          <div
            dangerouslySetInnerHTML={{ __html: markdownToHtml(input) }}
            className="h-[100px] overflow-y-auto !mb-3.5"
          />
        )}

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

        <div className="flex gap-1 justify-between">
          <div>
            <Button
              onClick={handleTurnOffPreview}
              variant={!isPreview ? 'ghost' : 'secondary'}
              disabled={!isPreview}
            >
              Write
            </Button>
            <Button
              onClick={handleTurnOnPreview}
              variant={isPreview ? 'ghost' : 'secondary'}
              disabled={isPreview}
            >
              Preview
            </Button>
          </div>

          <div className="flex gap-1">
            {editingMessage && (
              <Button variant="ghost" onClick={() => handleCancelEditing()}>
                Cancel
              </Button>
            )}
            <Button
              onClick={() => handleSend(input)}
              disabled={isInputEmpty() && isAttachmentsEmpty()}
            >
              {editingMessage ? 'Save' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
