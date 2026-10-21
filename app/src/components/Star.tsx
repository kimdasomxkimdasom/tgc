// 사이트의 반짝이 별 모티프 — 위아래·좌우 팔이 긴 8각 별
const points = Array.from({ length: 16 }, (_, i) => {
  const r = i % 2 === 1 ? 12 : i % 4 === 0 ? 50 : 32
  const a = (Math.PI / 8) * i - Math.PI / 2
  return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`
}).join(' ')

export default function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <polygon points={points} fill="currentColor" />
    </svg>
  )
}
