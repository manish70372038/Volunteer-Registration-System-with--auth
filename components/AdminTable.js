'use client';

import { useState } from 'react';

const STATUSES = ['Pending', 'Approved', 'Rejected'];

export default function AdminTable({ volunteers: initial }) {
  const [volunteers, setVolunteers] = useState(initial);
  const [error, setError] = useState('');

  async function updateStatus(id, status) {
    setError('');
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
      } else {
        setError(data.error || 'Failed to update status.');
      }
    } catch {
      setError('Network error while updating status.');
    }
  }

  async function deleteVolunteer(id, name) {
    if (!confirm(`Delete registration for "${name}"? This cannot be undone.`)) return;

    setError('');
    try {
      const res = await fetch(`/api/volunteers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setVolunteers((prev) => prev.filter((v) => v.id !== id));
      } else {
        setError(data.error || 'Failed to delete.');
      }
    } catch {
      setError('Network error while deleting.');
    }
  }

  if (volunteers.length === 0) {
    return <div className="empty-state"><p>No volunteers registered yet.</p></div>;
  }

  return (
    <div>
      {error && <div className="alert alert-error" style={{ margin: 16 }}>{error}</div>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Skill</th>
              <th>Availability</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v, i) => (
              <tr key={v.id}>
                <td>{i + 1}</td>
                <td><strong>{v.name}</strong></td>
                <td>{v.email}</td>
                <td>{v.phone}</td>
                <td><span className="badge">{v.skills}</span></td>
                <td>{v.availability}</td>
                <td>{new Date(v.created_at).toLocaleDateString('en-IN')}</td>
                <td>
                  <select
                    value={v.status || 'Pending'}
                    onChange={(e) => updateStatus(v.id, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 6, border: '1.5px solid #e2e8f0', fontSize: 13 }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => deleteVolunteer(v.id, v.name)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: 'none',
                      background: '#fef2f2',
                      color: '#991b1b',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
