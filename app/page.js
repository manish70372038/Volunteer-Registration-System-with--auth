import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className="hero">
        <h1>Make a <span>Difference</span> Today</h1>
        <p>
          Join thousands of volunteers and help build a better community.
          Registration takes less than 2 minutes.
        </p>
        <Link href="/register" className="btn btn-primary">Register as Volunteer</Link>
        <Link href="/volunteers" className="btn btn-secondary">View All Volunteers</Link>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Volunteers Registered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">20+</div>
            <div className="stat-label">Active Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Hours Contributed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
