import { MarkdownAlignmentTags } from '../constant/markdown';

const parseOl = (content: string): string => {
  return content.replace(/(^\d+\. .*$)(\n^\d+\. .*$)*/gim, (match) => {
    const lines = match.split('\n');
    const listItems = lines.map((line) => {
      const itemContent = line.replace(/^\d+\. /, '');
      return `<li>${itemContent}</li>`;
    });
    return `<ol>${listItems.join('')}</ol>`;
  });
};

const parseUl = (content: string): string => {
  return content.replace(/(^- .*$)(\n^- .*$)*/gim, (match) => {
    const lines = match.split('\n');
    const listItems = lines.map((line) => {
      const itemContent = line.replace(/^- /, '');
      return `<li>${itemContent}</li>`;
    });
    return `<ul>${listItems.join('')}</ul>`;
  });
};

const parseLists = (content: string): string => {
  let processedContent = content;

  processedContent = parseOl(processedContent);
  processedContent = parseUl(processedContent);

  return processedContent;
};

const parseAlignmentWithLists = (html: string): string => {
  let processedHtml = html;

  MarkdownAlignmentTags.forEach(({ tag, style }) => {
    const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/${tag}\\]`, 'g');
    processedHtml = processedHtml.replace(regex, (match, content) => {
      const contentWithLists = parseLists(content);
      return `<div style="${style}">${contentWithLists}</div>`;
    });
  });

  return processedHtml;
};

export const markdownToHtml = (markdown: string): string => {
  let html = markdown
    // bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // strikethrough
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    // code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // link
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

  // alignment
  html = parseAlignmentWithLists(html);
  // lists
  html = parseLists(html);
  // newlines
  html = html.replace(/\n/g, '<br>');

  return html;
};
