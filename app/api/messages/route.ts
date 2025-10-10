import db from '@/db';
import { NextResponse } from 'next/server';
import { messagesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allMessages = await db.select().from(messagesTable);
    return NextResponse.json(allMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { content, attachments, createdBy } = body;

    const message = await db
      .insert(messagesTable)
      .values({
        id: crypto.randomUUID(),
        content,
        createdBy,
        ...(attachments && { attachments: attachments.join(',') }),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(message[0]);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { id, content, reaction } = await request.json();
  try {
    await db
      .update(messagesTable)
      .set({ content, reaction: reaction || null })
      .where(eq(messagesTable.id, id));
    return NextResponse.json({ message: 'Message updated' });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (id === 'all') {
    await db.delete(messagesTable);
  } else {
    await db.delete(messagesTable).where(eq(messagesTable.id, id));
  }
  return NextResponse.json({ message: 'Message deleted' });
}
