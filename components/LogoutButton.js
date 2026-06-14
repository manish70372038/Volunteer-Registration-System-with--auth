'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="btn"
      style={{ background: '#fef2f2', color: '#991b1b', border: 'none', cursor: 'pointer' }}
    >
      Logout
    </button>
  );
}
