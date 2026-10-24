import { Navigate, useParams } from 'react-router-dom'
import CardGrid from '../components/CardGrid'
import CategoryTabs from '../components/CategoryTabs'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import { PARTNER_CATEGORIES, type PartnerCategory, fetchPartners, isPartnerCategory, partnerGradient } from '../lib/partner'
import { useAsync } from '../lib/useAsync'

export default function PartnerListPage() {
  const { category } = useParams()
  if (!isPartnerCategory(category)) return <Navigate to="/partners/fnb" replace />
  return <PartnerList category={category} />
}

function PartnerList({ category }: { category: PartnerCategory }) {
  const partners = useAsync(() => fetchPartners(category), [category])

  return (
    <>
      <PageHeader title="Partners" sub="파트너스" />
      <CategoryTabs base="/partners" categories={PARTNER_CATEGORIES} />

      <section className="px-4 pb-6">
        {partners.status === 'loading' && <Placeholder>불러오는 중…</Placeholder>}
        {partners.status === 'error' && <Placeholder>목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Placeholder>}
        {partners.status === 'success' &&
          (partners.data.length === 0 ? (
            <Placeholder>아직 등록된 파트너가 없어요</Placeholder>
          ) : (
            <CardGrid
              items={partners.data}
              linkTo={(p) => `/partners/${category}/${p.id}`}
              gradient={partnerGradient[category]}
            />
          ))}
      </section>
    </>
  )
}
