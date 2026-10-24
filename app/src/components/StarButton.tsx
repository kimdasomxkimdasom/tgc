import Star from './Star'

// 내 타임테이블 저장/해제 버튼 (별)
export default function StarButton({
  saved,
  onToggle,
  className = '',
}: {
  saved: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? '내 타임테이블에서 빼기' : '내 타임테이블에 저장'}
      className={`grid place-items-center rounded-full border-2 border-ink transition active:scale-90 ${
        saved ? 'bg-ink text-butter' : 'bg-paper text-ink/25'
      } ${className}`}
    >
      <Star className="size-[60%]" />
    </button>
  )
}
