import VolunteerForm from '@/components/VolunteerForm';

export const metadata = { title: 'Register — VolunteerHub' };

export default function RegisterPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Volunteer Registration</h1>
        <p>Fill in your details below to join our volunteer network.</p>
      </div>
      <VolunteerForm />
    </div>
  );
}
