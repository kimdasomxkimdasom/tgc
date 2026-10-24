import { Link, useParams } from 'react-router-dom'
import { PinnedBadge } from '../components/NoticeList'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import { formatFullDate } from '../lib/date'
import { fetchNotice } from '../lib/notice'
import { useAsync } from '../lib/useAsync'

export default function NoticeDetailPage() {
  const id = Number(useParams().id)
  const notice = useAsync(() => fetchNotice(id), [id])

  return (
    <>
      <PageHeader title="Notice" sub="공지사항" back="/more/notice" />
      <section className="p-4">
        {notice.status === 'loading' && <Placeholder>불러오는 중…</Placeholder>}
        {notice.status === 'error' && <Placeholder>공지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Placeholder>}
        {notice.status === 'success' && !notice.data && (
          <div className="space-y-3">
            <Placeholder>없거나 삭제된 공지예요</Placeholder>
            <Link to="/more/notice" className="inline-block text-sm font-semibold underline">
              공지 목록으로
            </Link>
          </div>
        )}
        {notice.status === 'success' && notice.data && (
          <article>
            <div className="flex items-center gap-2">
              {notice.data.is_pinned && <PinnedBadge />}
              <time className="text-xs text-ink/50">{formatFullDate(notice.data.created_at)}</time>
            </div>
            <h2 className="mt-2 text-xl font-bold leading-snug">{notice.data.title}</h2>
            <hr className="my-4 border-t-2 border-ink" />
            {/* 본문 줄바꿈 그대로 보여주기 */}
            <p className="whitespace-pre-line break-words text-[15px] leading-relaxed">{notice.data.content}</p>
          </article>
        )}
      </section>
    </>
  )
}
