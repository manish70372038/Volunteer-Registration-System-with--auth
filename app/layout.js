import './globals.css';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export const metadata = {
  title: 'Volunteer Registration System',
  description: 'Register as a volunteer and make a difference!',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  const isAdmin = session?.role === 'admin';

  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-container">
            <a href="/" className="nav-brand">🤝 VolunteerHub</a>
            <div className="nav-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/register" className="nav-link nav-link-primary">Register</a>
              <a href="/volunteers" className="nav-link">View Volunteers</a>
              {isAdmin ? (
                <a href="/admin" className="nav-link">Admin Dashboard</a>
              ) : (
                <a href="/login" className="nav-link">Admin Login</a>
              )}
            </div>
          </div>
        </nav>
        <main className="main-content">
          {children}
        </main>
        <footer className="footer">
          <p>© 2024 VolunteerHub — Making the world better, together.</p>
        </footer>
      </body>
    </html>
  );
}

