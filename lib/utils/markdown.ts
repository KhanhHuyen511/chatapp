export interface MarkdownState {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

export const markdownToHtml = (markdown: string): string => {
  let html = markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

  html = html.replace(/(^\d+\. .*$)(\n^\d+\. .*$)*/gim, (match) => {
    const lines = match.split('\n');
    const listItems = lines.map((line) => {
      const content = line.replace(/^\d+\. /, '');
      return `<li>${content}</li>`;
    });
    return `<ol>${listItems.join('')}</ol>`;
  });

  html = html.replace(/(^- .*$)(\n^- .*$)*/gim, (match) => {
    const lines = match.split('\n');
    const listItems = lines.map((line) => {
      const content = line.replace(/^- /, '');
      return `<li>${content}</li>`;
    });
    return `<ul>${listItems.join('')}</ul>`;
  });

  html = html.replace(/\n/g, '<br>');

  return html;
};
