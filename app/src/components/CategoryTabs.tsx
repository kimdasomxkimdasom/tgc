import { NavLink } from 'react-router-dom'

// 페이지 헤더 바로 아래 고정되는 카테고리 버튼 (파트너스, 프로그램 등)
export default function CategoryTabs({ base, categories }: { base: string; categories: readonly { key: string; en: string }[] }) {
  return (
    <nav className="sticky top-[58px] z-10 flex gap-2 overflow-x-auto bg-paper/95 px-4 py-3 backdrop-blur">
      {categories.map((c) => (
        <NavLink
          key={c.key}
          to={`${base}/${c.key}`}
          replace
          className={({ isActive }) =>
            `shrink-0 rounded-full border-2 border-ink px-3.5 py-1 font-display text-sm uppercase tracking-wide ${
              isActive ? 'bg-ink text-butter' : 'bg-transparent'
            }`
          }
        >
          {c.en}
        </NavLink>
      ))}
    </nav>
  )
}
