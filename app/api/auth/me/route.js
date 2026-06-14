import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ success: true, loggedIn: false });
  }

  return NextResponse.json({
    success: true,
    loggedIn: true,
    username: session.username,
    role: session.role,
  });
}
