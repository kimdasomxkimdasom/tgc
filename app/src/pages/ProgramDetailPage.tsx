import { Link, useParams } from 'react-router-dom'
import CoverImage from '../components/CoverImage'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import { PROGRAM_CATEGORIES, type Program, fetchProgram, programGradient } from '../lib/program'
import { useAsync } from '../lib/useAsync'

// 값이 있는 링크만 버튼으로
function links(p: Program) {
  return [
    p.spotify_url && { label: 'Spotify', href: p.spotify_url },
    p.apple_music_url && { label: 'Apple Music', href: p.apple_music_url },
    p.youtube_url && { label: 'YouTube', href: p.youtube_url },
    p.instagram && { label: `@${p.instagram}`, href: `https://instagram.com/${p.instagram}` },
  ].filter((l): l is { label: string; href: string } => Boolean(l))
}

export default function ProgramDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const program = useAsync(() => fetchProgram(id), [id])
  const listUrl = `/program/${params.category}`

  return (
    <>
      <PageHeader title="Program" sub="프로그램" back={listUrl} />
      <section className="p-4">
        {program.status === 'loading' && <Placeholder>불러오는 중…</Placeholder>}
        {program.status === 'error' && <Placeholder>정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Placeholder>}
        {program.status === 'success' && !program.data && (
          <div className="space-y-3">
            <Placeholder>없는 프로그램이에요</Placeholder>
            <Link to={listUrl} className="inline-block text-sm font-semibold underline">
              목록으로
            </Link>
          </div>
        )}
        {program.status === 'success' && program.data && <ProgramDetail program={program.data} />}
      </section>
    </>
  )
}

function ProgramDetail({ program: p }: { program: Program }) {
  return (
    <article className="space-y-5">
      <CoverImage
        src={p.image_url}
        name={p.name}
        initial={p.name_en ?? p.name}
        gradient={programGradient[p.category]}
        className="aspect-square w-full rounded-3xl border-2 border-ink text-8xl"
      />

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border-2 border-ink px-2.5 py-0.5 font-display text-xs uppercase tracking-wide">
            {PROGRAM_CATEGORIES.find((c) => c.key === p.category)?.en}
          </span>
          {p.tagline && (
            <span className="rounded-full bg-butter px-2.5 py-0.5 text-xs font-semibold">{p.tagline}</span>
          )}
        </div>
        <h2 className="mt-3 text-2xl font-bold leading-tight">{p.name}</h2>
        {p.name_en && p.name_en !== p.name && (
          <p className="mt-0.5 font-display text-lg uppercase tracking-wide text-ink/50">{p.name_en}</p>
        )}
      </div>

      {p.description && (
        <p className="whitespace-pre-line break-words text-[15px] leading-relaxed">{p.description}</p>
      )}

      {links(p).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links(p).map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper active:opacity-80"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      )}

      {/* 타임테이블(performance) 만들면 이 프로그램의 공연 시간 표시 */}
      <div>
        <h3 className="mb-2 font-display text-xl uppercase tracking-wide">Schedule</h3>
        <Placeholder>공연·진행 시간이 들어갈 자리</Placeholder>
      </div>
    </article>
  )
}
