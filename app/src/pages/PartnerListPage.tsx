import { Link, NavLink, Navigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import PartnerImage from '../components/PartnerImage'
import Placeholder from '../components/Placeholder'
import { PARTNER_CATEGORIES, fetchPartners, isPartnerCategory } from '../lib/partner'
import { useAsync } from '../lib/useAsync'

export default function PartnerListPage() {
  const { category } = useParams()
  if (!isPartnerCategory(category)) return <Navigate to="/partners/fnb" replace />
  return <PartnerList category={category} />
}

function PartnerList({ category }: { category: Parameters<typeof fetchPartners>[0] }) {
  const partners = useAsync(() => fetchPartners(category), [category])

  return (
    <>
      <PageHeader title="Partners" sub="파트너스" />

      {/* F&B / 액티비티 / 셀러 */}
      <nav className="sticky top-[58px] z-10 flex gap-2 bg-paper/95 px-4 py-3 backdrop-blur">
        {PARTNER_CATEGORIES.map((c) => (
          <NavLink
            key={c.key}
            to={`/partners/${c.key}`}
            replace
            className={({ isActive }) =>
              `rounded-full border-2 border-ink px-3.5 py-1 font-display text-sm uppercase tracking-wide ${
                isActive ? 'bg-ink text-butter' : 'bg-transparent'
              }`
            }
          >
            {c.en}
          </NavLink>
        ))}
      </nav>

      <section className="px-4 pb-6">
        {partners.status === 'loading' && <Placeholder>불러오는 중…</Placeholder>}
        {partners.status === 'error' && <Placeholder>목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Placeholder>}
        {partners.status === 'success' &&
          (partners.data.length === 0 ? (
            <Placeholder>아직 등록된 파트너가 없어요</Placeholder>
          ) : (
            <ul className="grid grid-cols-2 gap-3">
              {partners.data.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/partners/${category}/${p.id}`}
                    className="block overflow-hidden rounded-2xl border-2 border-ink bg-white/60 active:translate-y-0.5"
                  >
                    <PartnerImage partner={p} className="aspect-square w-full border-b-2 border-ink" />
                    <div className="px-3 py-2.5">
                      <p className="truncate text-sm font-bold">{p.name}</p>
                      {p.name_en && <p className="truncate text-[11px] uppercase text-ink/50">{p.name_en}</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
      </section>
    </>
  )
}
