import { NextResponse } from 'next/server';
import getDb, { hashPassword } from '@/lib/db';
import { createSessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.read();

    const user = db.data.users.find((u) => u.username === username);
    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user);
    const res = NextResponse.json({ success: true, message: 'Logged in successfully.' });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return res;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
