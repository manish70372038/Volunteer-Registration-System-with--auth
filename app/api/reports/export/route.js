import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import getDb from '@/lib/db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

function csvEscape(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// GET /api/reports/export — download all volunteers as CSV (admin only)
export async function GET() {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const db = await getDb();
    await db.read();

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Skill', 'Availability', 'Status', 'Message', 'Registered On'];
    const rows = db.data.volunteers.map((v) => [
      v.id,
      v.name,
      v.email,
      v.phone,
      v.skills,
      v.availability,
      v.status || 'Pending',
      v.message || '',
      new Date(v.created_at).toLocaleString('en-IN'),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(csvEscape).join(','))
      .join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="volunteers-report-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
