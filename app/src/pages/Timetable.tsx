import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'

export default function Timetable() {
  return (
    <>
      <PageHeader title="Time Table" sub="타임테이블" />
      <section className="p-4">
        <Placeholder>날짜별 · 스테이지별 공연 시간표 · 내 타임테이블 저장</Placeholder>
      </section>
    </>
  )
}
