# Chat App

A messaging app I built with rich text editing, file attachments, and reactions. It's a full-featured chat application using Next.js and TypeScript.

## What I Used

- **Next.js 15** - The React framework with App Router
- **TypeScript** - For type safety
- **React Context** - For state management (chat and auth)
- **Tailwind CSS v4** - For styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Day.js** - Date formatting
- **Custom Markdown Parser** - Built my own instead of using external libraries

## Features I Built

### Core Chat Features

- ✅ **Rich Text Editor** - Custom toolbar with formatting, lists, alignment, and preview mode
- ✅ **File Attachments** - Upload images, PDFs, documents with preview
- ✅ **Message Management** - Edit, delete, and react to messages
- ✅ **Markdown Support** - Bold, italic, strikethrough, code, links, lists
- ✅ **Responsive Design** - Works on mobile and desktop

### Interactive Stuff

- ✅ **Message Reactions** - Like, love, laugh, sad emoji reactions
- ✅ **Keyboard Shortcuts** - Ctrl+B (bold), Ctrl+I (italic), Ctrl+E (code), Ctrl+L (lists), Ctrl+Enter (send)
- ✅ **Smart Lists** - Auto-continue ordered and unordered lists
- ✅ **Clipboard Support** - Paste images and auto-format URLs
- ✅ **User Avatars** - Show who sent what with timestamps

## How to Run It

### What You Need

- Node.js 18+
- pnpm (or npm)

### Quick Start

1. **Clone and install:**

   ```bash
   git clone <repository-url>
   cd chatapp
   pnpm install
   ```

2. **Start the dev server:**

   ```bash
   pnpm dev
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
pnpm build
pnpm start
```

## License

Built for technical assessment purposes.
