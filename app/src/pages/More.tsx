import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

type Menu = { label: string; en: string; to?: string; href?: string }

// to: 앱 안 화면 / href: 공식 사이트로 이동 / 둘 다 없으면 준비 중
const menus: Menu[] = [
  { to: '/more/notice', label: '공지사항', en: 'Notice' },
  { href: 'https://thegratefulcamp.com/board/gallery/list.html?board_no=8', label: '소식', en: 'News' },
  { label: 'Q&A', en: 'FAQ' },
  { label: '문의하기', en: 'Contact' },
]

export default function More() {
  return (
    <>
      <PageHeader title="More" sub="더보기" />
      <ul className="divide-y divide-ink/10">
        {menus.map((m) => {
          const content = (
            <>
              <span className="font-display text-lg uppercase tracking-wide">{m.en}</span>
              <span className="text-sm font-medium">{m.label}</span>
              <span className="ml-auto text-ink/40">{m.to ? '›' : m.href ? '↗' : '준비 중'}</span>
            </>
          )
          const className = 'flex items-center gap-3 px-4 py-4 active:bg-butter/40'
          return (
            <li key={m.label}>
              {m.to ? (
                <Link to={m.to} className={className}>
                  {content}
                </Link>
              ) : m.href ? (
                <a href={m.href} target="_blank" rel="noreferrer" className={className}>
                  {content}
                </a>
              ) : (
                <div className="flex items-center gap-3 px-4 py-4 text-ink/40">{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
