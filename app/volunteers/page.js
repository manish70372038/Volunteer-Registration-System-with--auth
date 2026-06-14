import VolunteerTable from '@/components/VolunteerTable';
import Link from 'next/link';

export const metadata = { title: 'All Volunteers — VolunteerHub' };

export default function VolunteersPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Registered Volunteers</h1>
          <p>All volunteers who have signed up through the system.</p>
        </div>
        <Link href="/register" className="btn btn-primary">+ Register New</Link>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <VolunteerTable />
      </div>
    </div>
  );
}
