import React, { useRef, useState } from 'react';
import {
  insertFormattingUtil,
  insertListUtil,
  insertAlignmentUtil,
} from '@/lib/utils/insertMarkdown';

type UseTextEditorProps = {
  onSend?: (input: string) => void;
  onFileAttach?: (files: File[]) => void;
};

type UseTextEditorReturn = {
  input: string;
  setInput: (value: string) => void;
  editorRef: React.RefObject<HTMLTextAreaElement | null>;

  insertFormatting: (before: string, after: string) => void;
  insertList: (type: 'ordered' | 'unordered') => void;
  insertAlignment: (alignment: 'left' | 'center' | 'right' | 'justify') => void;

  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;

  isInputEmpty: () => boolean;
  resetTextEditor: () => void;
};

export const useTextEditor = ({
  onSend,
  onFileAttach,
}: UseTextEditorProps): UseTextEditorReturn => {
  const [input, setInput] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (before: string, after: string) => {
    insertFormattingUtil(before, after, {
      input,
      selectionStart: editorRef.current?.selectionStart || 0,
      selectionEnd: editorRef.current?.selectionEnd || 0,
      onUpdate: setInput,
      onCursorUpdate: (start, end) => {
        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.setSelectionRange(start, end);
        }
      },
    });
  };

  const insertList = (type: 'ordered' | 'unordered') => {
    insertListUtil(type, {
      input,
      selectionStart: editorRef.current?.selectionStart || 0,
      selectionEnd: editorRef.current?.selectionEnd || 0,
      onUpdate: setInput,
      onCursorUpdate: (start, end) => {
        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.setSelectionRange(start, end);
        }
      },
    });
  };

  const insertAlignment = (
    alignment: 'left' | 'center' | 'right' | 'justify' = 'center'
  ) => {
    insertAlignmentUtil(alignment, {
      input,
      selectionStart: editorRef.current?.selectionStart || 0,
      selectionEnd: editorRef.current?.selectionEnd || 0,
      onUpdate: setInput,
      onCursorUpdate: (start, end) => {
        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.setSelectionRange(start, end);
        }
      },
    });
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
      onSend?.(input);
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
        onFileAttach?.([file]);
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.currentTarget.value || '');
  };

  const isInputEmpty = () => {
    return input.trim() === '';
  };

  const resetTextEditor = () => {
    setInput('');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  return {
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
  };
};
