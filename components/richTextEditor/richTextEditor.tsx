'use client';

import React, { FC, useEffect } from 'react';
import { Button } from '../ui/button';
import { useChat } from '@/contexts/chatContext';
import Toolbar from './toolbar';
import Attachment from './attachment';
import { markdownToHtml } from '@/lib/utils/markdown';
import { CreateMessageParams, Message } from '@/lib/types/message';
import { useTextEditor } from '@/hooks/useTextEditor';
import { useFileAttachments } from '@/hooks/useFileAttachments';
import { usePreview } from '@/hooks/usePreview';
import { useAuth } from '@/contexts/authContext';
import { cn } from '@/lib/utils';

const RichTextEditor = () => {
  const { user } = useAuth();
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

    if (!user) {
      throw new Error('User not found');
    }

    if (editingMessage) {
      editMessage({
        ...editingMessage,
        content: message,
        attachments: attachedFiles,
      });
    } else {
      const newMessage: CreateMessageParams = {
        content: message,
        ...(attachedFiles.length > 0 && { attachments: attachedFiles }),
      };

      addMessage(newMessage as Message, user);
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
          placeholder="Type your message here"
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
              key={index}
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
            className={cn('disabled:opacity-100', isPreview && 'opacity-50')}
            disabled={!isPreview}
          >
            Write
          </Button>
          <Button
            onClick={handleTurnOnPreview}
            variant={isPreview ? 'ghost' : 'secondary'}
            className={cn('disabled:opacity-100', !isPreview && 'opacity-50')}
            disabled={isPreview}
          >
            Preview
          </Button>
        </div>

        <div className="flex gap-2 items-center ">
          <small className="text-xs text-gray-500">(Ctrl + Enter)</small>
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
  );
};

export default RichTextEditor;
