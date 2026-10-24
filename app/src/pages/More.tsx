import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const menus = [
  { to: '/more/notice', label: '공지사항', en: 'Notice' },
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
              <span className="ml-auto text-ink/40">{m.to ? '›' : '준비 중'}</span>
            </>
          )
          return (
            <li key={m.label}>
              {m.to ? (
                <Link to={m.to} className="flex items-center gap-3 px-4 py-4 active:bg-butter/40">
                  {content}
                </Link>
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
