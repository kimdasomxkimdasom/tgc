// 아직 만들지 않은 영역 자리 표시
export default function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink/25 p-4 text-sm text-ink/50">{children}</div>
  )
}
