import ApplicationList from '@/components/applications/ApplicationList';

export default function CompanyApplicationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Postulaciones Recibidas</h1>
      <ApplicationList type="company" />
    </div>
  );
}