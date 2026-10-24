import { Link } from 'react-router-dom'
import { formatDate } from '../lib/date'
import type { NoticeSummary } from '../lib/notice'

export function PinnedBadge() {
  return (
    <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-butter">고정</span>
  )
}

// 홈과 공지 목록 화면에서 같이 쓰는 공지 목록
export default function NoticeList({ notices }: { notices: NoticeSummary[] }) {
  return (
    <ul className="divide-y divide-ink/10 overflow-hidden rounded-2xl border-2 border-ink bg-white/60">
      {notices.map((n) => (
        <li key={n.id}>
          <Link
            to={`/more/notice/${n.id}`}
            className="flex items-center gap-2 px-4 py-3 text-sm active:bg-butter/40"
          >
            {n.is_pinned && <PinnedBadge />}
            <span className="truncate font-medium">{n.title}</span>
            <span className="ml-auto shrink-0 text-xs text-ink/45">{formatDate(n.created_at)}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
