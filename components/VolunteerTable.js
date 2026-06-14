'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VolunteerTable() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/volunteers')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setVolunteers(data.data);
        else setError(data.error);
      })
      .catch(() => setError('Failed to load volunteers.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#718096' }}>Loading volunteers...</p>;
  if (error)   return <div className="alert alert-error">{error}</div>;

  if (volunteers.length === 0) {
    return (
      <div className="empty-state">
        <p>No volunteers registered yet.</p>
        <Link href="/register" className="btn btn-primary">Be the first!</Link>
      </div>
    );
  }

  return (
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
            <th>Registered On</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
