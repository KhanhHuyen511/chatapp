import db from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get('name');

  if (name) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.name, name));

    if (user.length === 0) {
      return NextResponse.json(null);
    }

    return NextResponse.json(user[0]);
  }

  const users = await db.select().from(usersTable);
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { name } = await request.json();

  const user = await db
    .insert(usersTable)
    .values({ id: crypto.randomUUID(), name })
    .returning();

  return NextResponse.json(user[0]);
}
