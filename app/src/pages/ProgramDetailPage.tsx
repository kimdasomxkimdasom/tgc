import { Link, useParams } from 'react-router-dom'
import CoverImage from '../components/CoverImage'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import StarButton from '../components/StarButton'
import { PROGRAM_CATEGORIES, type Program, fetchProgram, programGradient } from '../lib/program'
import { useMyTimetable } from '../lib/myTimetable'
import { fetchProgramPerformances, formatFestivalDay, formatPerformanceTime } from '../lib/timetable'
import { useAsync } from '../lib/useAsync'

// 라인업 듣기 링크: 등록된 주소가 있으면 그 주소, 없으면 각 서비스 검색 결과로 연결
// (폰에서는 https 링크가 설치된 앱으로 열림)
function listenLinks(p: Program) {
  const q = encodeURIComponent(p.name_en ?? p.name)
  return [
    { label: 'Apple Music', dot: 'bg-[#fa2d48]', href: p.apple_music_url ?? `https://music.apple.com/kr/search?term=${q}` },
    { label: 'Spotify', dot: 'bg-[#1ed760]', href: p.spotify_url ?? `https://open.spotify.com/search/${q}` },
    { label: 'YouTube', dot: 'bg-[#ff0000]', href: p.youtube_url ?? `https://www.youtube.com/results?search_query=${q}` },
  ]
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

      {p.category === 'lineup' && (
        <div>
          <h3 className="mb-2 font-display text-xl uppercase tracking-wide">Listen</h3>
          <div className="grid grid-cols-3 gap-2">
            {listenLinks(p).map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-ink bg-white/60 px-2 py-3 text-[13px] font-bold shadow-[3px_3px_0_var(--color-ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <span className={`size-2.5 shrink-0 rounded-full ${l.dot}`} aria-hidden="true" />
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {p.instagram && (
        <a
          href={`https://instagram.com/${p.instagram}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper active:opacity-80"
        >
          @{p.instagram} ↗
        </a>
      )}

      <Schedule programId={p.id} />
    </article>
  )
}

// 이 프로그램의 공연·진행 일정 (타임테이블에서)
function Schedule({ programId }: { programId: number }) {
  const performances = useAsync(() => fetchProgramPerformances(programId), [programId])
  const my = useMyTimetable()
  if (performances.status !== 'success' || performances.data.length === 0) return null

  return (
    <div>
      <h3 className="mb-2 font-display text-xl uppercase tracking-wide">Schedule</h3>
      <ul className="divide-y divide-ink/10 overflow-hidden rounded-2xl border-2 border-ink bg-white/60">
        {performances.data.map((perf) => {
          const { date, weekday } = formatFestivalDay(perf.festival_day)
          return (
            <li key={perf.id} className="flex items-center gap-2 pr-3">
              <Link
                to={`/timetable?day=${perf.festival_day}`}
                className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-0.5 py-3 pl-4 text-sm active:bg-butter/40"
              >
                <span className="font-display text-base uppercase tracking-wide">
                  {date} {weekday}
                </span>
                <span className="font-semibold">{formatPerformanceTime(perf)}</span>
                <span className="text-xs font-semibold uppercase text-ink/55">{perf.stage.name}</span>
              </Link>
              <StarButton saved={my.has(perf.id)} onToggle={() => my.toggle(perf.id)} className="size-9 shrink-0" />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
