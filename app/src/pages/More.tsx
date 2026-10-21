import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'

export default function More() {
  return (
    <>
      <PageHeader title="More" sub="더보기" />
      <section className="p-4">
        <Placeholder>공지사항 · Q&A · 문의하기</Placeholder>
      </section>
    </>
  )
}
