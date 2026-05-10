import JobOfferList from '@/components/offers/JobOfferList';

export default function ManageOffersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Ofertas Laborales</h1>
      <JobOfferList showAdminActions />
    </div>
  );
}