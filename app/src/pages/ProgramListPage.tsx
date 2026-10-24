import { Navigate, useParams } from 'react-router-dom'
import CardGrid from '../components/CardGrid'
import CategoryTabs from '../components/CategoryTabs'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import { PROGRAM_CATEGORIES, type ProgramCategory, fetchPrograms, isProgramCategory, programGradient } from '../lib/program'
import { useAsync } from '../lib/useAsync'

export default function ProgramListPage() {
  const { category } = useParams()
  if (!isProgramCategory(category)) return <Navigate to="/program/lineup" replace />
  return <ProgramList category={category} />
}

function ProgramList({ category }: { category: ProgramCategory }) {
  const programs = useAsync(() => fetchPrograms(category), [category])

  return (
    <>
      <PageHeader title="Program" sub="프로그램" />
      <CategoryTabs base="/program" categories={PROGRAM_CATEGORIES} />

      <section className="px-4 pb-6">
        {programs.status === 'loading' && <Placeholder>불러오는 중…</Placeholder>}
        {programs.status === 'error' && <Placeholder>목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Placeholder>}
        {programs.status === 'success' &&
          (programs.data.length === 0 ? (
            <Placeholder>아직 공개된 프로그램이 없어요</Placeholder>
          ) : (
            <CardGrid
              items={programs.data}
              linkTo={(p) => `/program/${category}/${p.id}`}
              gradient={programGradient[category]}
            />
          ))}
      </section>
    </>
  )
}
