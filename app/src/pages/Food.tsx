import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'

export default function Food() {
  return (
    <>
      <PageHeader title="F&B" sub="푸드" />
      <section className="p-4">
        <Placeholder>F&B 매장 목록 · 메뉴 · 웨이팅</Placeholder>
      </section>
    </>
  )
}
