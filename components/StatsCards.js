export default function StatsCards({ volunteers }) {
  const total = volunteers.length;
  const pending = volunteers.filter((v) => (v.status || 'Pending') === 'Pending').length;
  const approved = volunteers.filter((v) => v.status === 'Approved').length;
  const skillSet = new Set(volunteers.map((v) => v.skills));

  const cards = [
    { label: 'Total Volunteers', value: total },
    { label: 'Pending Review', value: pending },
    { label: 'Approved', value: approved },
    { label: 'Unique Skills', value: skillSet.size },
  ];

  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 0, maxWidth: '100%' }}>
      {cards.map((c) => (
        <div className="stat-card" key={c.label}>
          <div className="stat-number">{c.value}</div>
          <div className="stat-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
