import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

// GET /api/volunteers — list all volunteers
export async function GET() {
  try {
    const db = await getDb();
    await db.read();
    const volunteers = [...db.data.volunteers].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return NextResponse.json({ success: true, data: volunteers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/volunteers — register a new volunteer
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, skills, availability, message } = body;

    // Basic validation
    if (!name || !email || !phone || !skills || !availability) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.read();

    // Duplicate email check
    const exists = db.data.volunteers.some(
      (v) => v.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered.' },
        { status: 409 }
      );
    }

    const newVolunteer = {
      id: db.data.nextId,
      name,
      email,
      phone,
      skills,
      availability,
      message: message || '',
      status: 'Pending',
      adminNotes: '',
      created_at: new Date().toISOString(),
    };

    db.data.volunteers.push(newVolunteer);
    db.data.nextId += 1;
    await db.write();

    return NextResponse.json(
      { success: true, message: 'Registered successfully!', id: newVolunteer.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
