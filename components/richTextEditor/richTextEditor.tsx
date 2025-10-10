'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { useChat } from '@/contexts/chatContext';
import Toolbar from './toolbar';
import Attachment from './attachment';
import { markdownToHtml } from '@/lib/utils/markdown';
import { Message } from '@/lib/types/message';

type Props = {
  className?: string;
};

const RichTextEditor: FC<Props> = ({ className }) => {
  const { addMessage, editingMessage, editMessage, setEditingMessage } =
    useChat();

  const [input, setInput] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  // Set input and attached files when editing message
  useEffect(() => {
    if (editingMessage) {
      setInput(editingMessage.content);
      setAttachedFiles(editingMessage.attachments || []);
    }
  }, [editingMessage]);

  const handleSend = (message: string) => {
    if (isInputEmpty()) return;

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

  const handleReset = () => {
    setInput('');
    setAttachedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    setIsPreview(false);
  };

  const insertFormatting = (before: string, after: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = input.substring(start, end);
    const newText =
      input.substring(0, start) +
      before +
      selectedText +
      after +
      input.substring(end);

    setInput(newText);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertList = (type: 'ordered' | 'unordered') => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = input.substring(start, end);

    if (start === end || selectedText.trim() === '') {
      const marker = type === 'ordered' ? '1. ' : '- ';
      const newText = input.substring(0, start) + marker + input.substring(end);
      setInput(newText);

      // Set cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + marker.length,
          start + marker.length
        );
      }, 0);
      return;
    }

    // Split selected text into lines
    const lines = selectedText.split('\n');
    console.log(lines);
    const formattedLines = lines.map((line, index) => {
      if (line.trim() === '') return line;
      if (type === 'ordered') {
        return `${index + 1}. ${line}`;
      } else {
        return `- ${line}`;
      }
    });

    const formattedText = formattedLines.join('\n');
    const newText =
      input.substring(0, start) + formattedText + input.substring(end);

    setInput(newText);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  const insertAlignment = (
    alignment: 'left' | 'center' | 'right' | 'justify' = 'center'
  ) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = input.substring(start, end);

    const newText =
      input.substring(0, start) +
      `[${alignment}]` +
      selectedText +
      `[/${alignment}]` +
      input.substring(end);

    setInput(newText);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + selectedText.length + 8);
    }, 0);
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

  const handleTurnOnPreview = () => {
    setIsPreview(true);
  };

  const handleTurnOffPreview = () => {
    setIsPreview(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.currentTarget.value || '');
  };

  const isInputEmpty = () => {
    return input.trim() === '' && attachedFiles.length === 0;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      const textarea = editorRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = input.substring(0, cursorPos);
      const textAfterCursor = input.substring(cursorPos);

      // Find the current line
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];

      // Check for unordered list (- )
      const unorderedMatch = currentLine.match(/^(\s*)- (.*)$/);
      if (unorderedMatch) {
        e.preventDefault();
        const indent = unorderedMatch[1];
        const content = unorderedMatch[2];

        if (content.trim() === '') {
          const newText =
            textBeforeCursor.slice(0, -2) + '\n' + textAfterCursor;
          setInput(newText);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(cursorPos - 1, cursorPos - 1);
          }, 0);
          return;
        }

        const newText =
          textBeforeCursor + '\n' + indent + '- ' + textAfterCursor;
        setInput(newText);
        setTimeout(() => {
          textarea.focus();
          const newPos = cursorPos + indent.length + 3;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
        return;
      }

      const orderedMatch = currentLine.match(/^(\s*)(\d+)\. (.*)$/);
      if (orderedMatch) {
        e.preventDefault();
        const indent = orderedMatch[1];
        const number = Number.parseInt(orderedMatch[2]);
        const content = orderedMatch[3];

        if (content.trim() === '') {
          const markerLength = orderedMatch[0].length - content.length;
          const newText =
            textBeforeCursor.slice(0, -markerLength) + '\n' + textAfterCursor;
          setInput(newText);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
              cursorPos - markerLength + 1,
              cursorPos - markerLength + 1
            );
          }, 0);
          return;
        }

        const nextNumber = number + 1;
        const newText =
          textBeforeCursor +
          '\n' +
          indent +
          nextNumber +
          '. ' +
          textAfterCursor;
        setInput(newText);
        setTimeout(() => {
          textarea.focus();
          const newPos =
            cursorPos + indent.length + nextNumber.toString().length + 3;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
        return;
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend(input);
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        insertFormatting('**', '**');
      } else if (e.key === 'i') {
        e.preventDefault();
        insertFormatting('*', '*');
      } else if (e.key === 'e') {
        e.preventDefault();
        insertFormatting('`', '`');
      } else if (e.key === 'l') {
        e.preventDefault();
        insertList('unordered');
      } else if (e.key === 'o') {
        e.preventDefault();
        insertList('ordered');
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (e.clipboardData.types.includes('text/plain')) {
      const pastedText = e.clipboardData.getData('text/plain');
      const urlRegex = /^https?:\/\/[^\s]+$/i;
      const isUrl = urlRegex.test(pastedText);
      if (isUrl) {
        e.preventDefault();
        insertFormatting('[', `](${pastedText})`);
        return;
      }
    }

    const items = Array.from(e.clipboardData.items);
    const images = items.filter((item) => item.type.startsWith('image'));

    if (images.length > 0) {
      e.preventDefault();
      const file = images[0].getAsFile();
      if (file) {
        setAttachedFiles((prev) => [...prev, file]);
      }
    }
  };

  const handleCancelEditing = () => {
    setEditingMessage(null);
    setInput('');
    setAttachedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    setIsPreview(false);
    editorRef.current?.focus();
  };

  return (
    <div className={className}>
      <div className="border px-4 pb-4 pt-2 rounded-xl space-y-2">
        {/* Toolbar */}
        <Toolbar
          onInsertFormatting={insertFormatting}
          handleFileAttach={handleFileAttach}
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
            <Button onClick={() => handleSend(input)} disabled={isInputEmpty()}>
              {editingMessage ? 'Save' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
