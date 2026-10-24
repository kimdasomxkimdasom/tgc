import type { PartnerSummary } from '../lib/partner'

const fallbackBg = {
  fnb: 'from-sunset to-pink',
  activity: 'from-butter to-teal',
  seller: 'from-pink to-butter',
}

// 대표 이미지, 없으면 카테고리 색 배경에 이름 첫 글자
export default function PartnerImage({ partner, className = '' }: { partner: PartnerSummary; className?: string }) {
  if (partner.image_url) {
    return <img src={partner.image_url} alt={partner.name} loading="lazy" className={`object-cover ${className}`} />
  }
  return (
    <div
      aria-hidden="true"
      className={`grain flex items-center justify-center bg-gradient-to-br ${fallbackBg[partner.category]} font-display text-4xl uppercase ${className}`}
    >
      {(partner.name_en ?? partner.name).slice(0, 1)}
    </div>
  )
}
