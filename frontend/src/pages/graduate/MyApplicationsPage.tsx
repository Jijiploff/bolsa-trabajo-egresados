import ApplicationList from '@/components/applications/ApplicationList';

export default function MyApplicationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Postulaciones</h1>
      <ApplicationList type="graduate" />
    </div>
  );
}