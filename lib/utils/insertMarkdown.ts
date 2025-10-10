export type InsertOptions = {
  input: string;
  selectionStart: number;
  selectionEnd: number;
  onUpdate: (newText: string) => void;
  onCursorUpdate: (start: number, end: number) => void;
};

export const insertFormattingUtil = (
  before: string,
  after: string,
  options: InsertOptions
) => {
  const { input, selectionStart, selectionEnd, onUpdate, onCursorUpdate } =
    options;

  const start = selectionStart;
  const end = selectionEnd;
  const selectedText = input.substring(start, end);
  const newText =
    input.substring(0, start) +
    before +
    selectedText +
    after +
    input.substring(end);

  onUpdate(newText);

  // Reset cursor position
  setTimeout(() => {
    onCursorUpdate(start + before.length, end + before.length);
  }, 0);
};

export const insertListUtil = (
  type: 'ordered' | 'unordered',
  options: InsertOptions
) => {
  const { input, selectionStart, selectionEnd, onUpdate, onCursorUpdate } =
    options;

  const start = selectionStart;
  const end = selectionEnd;
  const selectedText = input.substring(start, end);

  if (start === end || selectedText.trim() === '') {
    const marker = type === 'ordered' ? '1. ' : '- ';
    const newText = input.substring(0, start) + marker + input.substring(end);
    onUpdate(newText);

    // Set cursor position
    setTimeout(() => {
      onCursorUpdate(start + marker.length, start + marker.length);
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

  onUpdate(newText);

  // Set cursor position after formatting
  setTimeout(() => {
    onCursorUpdate(start, start + formattedText.length);
  }, 0);
};

export const insertAlignmentUtil = (
  alignment: 'left' | 'center' | 'right' | 'justify' = 'center',
  options: InsertOptions
) => {
  const { input, selectionStart, selectionEnd, onUpdate, onCursorUpdate } =
    options;

  const start = selectionStart;
  const end = selectionEnd;
  const selectedText = input.substring(start, end);

  const newText =
    input.substring(0, start) +
    `[${alignment}]` +
    selectedText +
    `[/${alignment}]` +
    input.substring(end);

  onUpdate(newText);

  // Set cursor position
  setTimeout(() => {
    onCursorUpdate(start, start + selectedText.length + 8);
  }, 0);
};
