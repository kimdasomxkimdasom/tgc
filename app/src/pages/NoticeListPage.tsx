import NoticeList from '../components/NoticeList'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import { fetchNotices } from '../lib/notice'
import { useAsync } from '../lib/useAsync'

export default function NoticeListPage() {
  const notices = useAsync(() => fetchNotices(), [])

  return (
    <>
      <PageHeader title="Notice" sub="공지사항" back="/more" />
      <section className="p-4">
        {notices.status === 'loading' && <Placeholder>불러오는 중…</Placeholder>}
        {notices.status === 'error' && <Placeholder>공지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Placeholder>}
        {notices.status === 'success' &&
          (notices.data.length === 0 ? (
            <Placeholder>등록된 공지가 없어요</Placeholder>
          ) : (
            <NoticeList notices={notices.data} />
          ))}
      </section>
    </>
  )
}
