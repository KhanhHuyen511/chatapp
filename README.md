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
- **SQLite** - Local database with Drizzle ORM
- **Drizzle Kit** - Database migrations and schema management

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
- ✅ **Clipboard Support** - Paste images and auto-format URLs

## Note

- Every time reload -> login again -> old chat will be displayed
- Not support send attachments -> reload -> old attachments not stored

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

2. **Set up environment variables:**

   Create .env file at root folder:

   ```env
   DB_FILE_NAME="file:./local.db"
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Set up the database:**

   ```bash
   # Generate database migrations
   pnpm db:generate

   # Run database migrations
   pnpm db:migrate
   ```

4. **Start the dev server:**

   ```bash
   pnpm dev
   ```

5. **Open your browser:**

   ```
   http://localhost:3000
   ```

6. **Login by name:**

   ```
   kalen
   ```

7. **Login by other name:**
   ```
   - To view messages from `kalen`
   - Reply kalen
   ```

### Environment Variables

The app requires a `.env` file with the following variables:

- `DB_FILE_NAME` - Path to your SQLite database file (default: `local.db`)

Copy `.env.example` to `.env` and update the values as needed.

### Database Schema

The app uses SQLite with Drizzle ORM and includes these tables:

- **users_table** - User information (id, name)
- **messages_table** - Chat messages (id, content, reaction, createdAt, createdBy)
- **attachments_table** - File attachments (id, messageId, fileName, fileType, fileSize, filePath, mimeType, createdAt)

### Build for Production

```bash
# Set up environment variables
cp .env.example .env

# Generate and run database migrations
pnpm db:generate
pnpm db:migrate

# Build the application
pnpm build
pnpm start
```

## License

Built for technical assessment purposes.
