import getDb from '@/lib/db';
import StatsCards from '@/components/StatsCards';
import AdminTable from '@/components/AdminTable';
import LogoutButton from '@/components/LogoutButton';

export const metadata = { title: 'Admin Dashboard — VolunteerHub' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const db = await getDb();
  await db.read();
  const volunteers = [...db.data.volunteers].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage volunteer registrations, update statuses, and export reports.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/api/reports/export" className="btn btn-secondary" download>
            ⬇ Export CSV
          </a>
          <LogoutButton />
        </div>
      </div>

      <StatsCards volunteers={volunteers} />

      <div className="card" style={{ padding: 0, overflow: 'hidden', marginTop: 24 }}>
        <AdminTable volunteers={volunteers} />
      </div>
    </div>
  );
}
