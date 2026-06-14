import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import getDb from '@/lib/db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

async function requireAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  return session && session.role === 'admin';
}

// GET /api/volunteers/[id] — get single volunteer
export async function GET(request, { params }) {
  try {
    const db = await getDb();
    await db.read();
    const volunteer = db.data.volunteers.find((v) => v.id === Number(params.id));

    if (!volunteer) {
      return NextResponse.json({ success: false, error: 'Volunteer not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: volunteer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/volunteers/[id] — update status/notes (admin only)
export async function PATCH(request, { params }) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const db = await getDb();
    await db.read();

    const volunteer = db.data.volunteers.find((v) => v.id === Number(params.id));
    if (!volunteer) {
      return NextResponse.json({ success: false, error: 'Volunteer not found.' }, { status: 404 });
    }

    if (body.status !== undefined) volunteer.status = body.status;
    if (body.adminNotes !== undefined) volunteer.adminNotes = body.adminNotes;

    await db.write();
    return NextResponse.json({ success: true, data: volunteer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/volunteers/[id] — remove a volunteer (admin only)
export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const db = await getDb();
    await db.read();

    const id = Number(params.id);
    const before = db.data.volunteers.length;
    db.data.volunteers = db.data.volunteers.filter((v) => v.id !== id);

    if (db.data.volunteers.length === before) {
      return NextResponse.json({ success: false, error: 'Volunteer not found.' }, { status: 404 });
    }

    await db.write();
    return NextResponse.json({ success: true, message: 'Volunteer deleted.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
