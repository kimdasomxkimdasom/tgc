// 대표 이미지, 없으면 그라데이션 배경에 이름 첫 글자
// gradient는 화면마다 구분되는 색 (예: 파트너 카테고리별), 글자 크기는 className으로
export default function CoverImage({
  src,
  name,
  initial,
  gradient,
  className = '',
}: {
  src: string | null
  name: string
  initial: string
  gradient: string
  className?: string
}) {
  if (src) {
    return <img src={src} alt={name} loading="lazy" className={`object-cover ${className}`} />
  }
  return (
    <div
      aria-hidden="true"
      className={`grain flex items-center justify-center bg-gradient-to-br ${gradient} font-display uppercase ${className}`}
    >
      {initial.slice(0, 1)}
    </div>
  )
}
