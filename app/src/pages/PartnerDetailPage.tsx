import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import PartnerImage from '../components/PartnerImage'
import Placeholder from '../components/Placeholder'
import { PARTNER_CATEGORIES, fetchPartner } from '../lib/partner'
import { useAsync } from '../lib/useAsync'

export default function PartnerDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const partner = useAsync(() => fetchPartner(id), [id])
  const listUrl = `/partners/${params.category}`

  return (
    <>
      <PageHeader title="Partners" sub="파트너스" back={listUrl} />
      <section className="p-4">
        {partner.status === 'loading' && <Placeholder>불러오는 중…</Placeholder>}
        {partner.status === 'error' && <Placeholder>정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Placeholder>}
        {partner.status === 'success' && !partner.data && (
          <div className="space-y-3">
            <Placeholder>없는 파트너예요</Placeholder>
            <Link to={listUrl} className="inline-block text-sm font-semibold underline">
              목록으로
            </Link>
          </div>
        )}
        {partner.status === 'success' && partner.data && (
          <article className="space-y-5">
            <PartnerImage partner={partner.data} className="aspect-square w-full rounded-3xl border-2 border-ink" />

            <div>
              <span className="rounded-full border-2 border-ink px-2.5 py-0.5 font-display text-xs uppercase tracking-wide">
                {PARTNER_CATEGORIES.find((c) => c.key === partner.data!.category)?.en}
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-tight">{partner.data.name}</h2>
              {partner.data.name_en && (
                <p className="mt-0.5 font-display text-lg uppercase tracking-wide text-ink/50">{partner.data.name_en}</p>
              )}
            </div>

            {partner.data.description && (
              <p className="whitespace-pre-line break-words text-[15px] leading-relaxed">{partner.data.description}</p>
            )}

            {partner.data.instagram && (
              <a
                href={`https://instagram.com/${partner.data.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper active:opacity-80"
              >
                @{partner.data.instagram} ↗
              </a>
            )}

            {/* 메뉴 / 호출 알림은 기획 정리 후 추가 — notes/TECH_DECISIONS.md "F&B 메뉴·호출 알림" */}
            {partner.data.category === 'fnb' && (
              <div>
                <h3 className="mb-2 font-display text-xl uppercase tracking-wide">Menu</h3>
                <Placeholder>메뉴가 들어갈 자리</Placeholder>
              </div>
            )}
          </article>
        )}
      </section>
    </>
  )
}
