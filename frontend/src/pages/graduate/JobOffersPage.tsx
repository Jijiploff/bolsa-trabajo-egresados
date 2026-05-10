import JobOfferList from '@/components/offers/JobOfferList';

export default function JobOffersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ofertas Laborales Disponibles</h1>
      <JobOfferList showApply />
    </div>
  );
}