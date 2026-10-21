import Star from './Star'

// 영문 대문자 제목(Anton) + 한글 부제
export default function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="sticky top-0 z-10 flex items-end gap-2 border-b-2 border-ink bg-paper/95 px-4 pb-2.5 pt-4 backdrop-blur">
      <h1 className="font-display text-3xl uppercase leading-none tracking-wide">{title}</h1>
      {sub && <p className="pb-0.5 text-xs font-semibold text-ink/55">{sub}</p>}
      <Star className="ml-auto size-5 self-center text-sunset" />
    </header>
  )
}
