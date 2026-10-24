import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import {
  type Performance,
  type Stage,
  fetchTimetable,
  formatFestivalDay,
  formatMinutes,
  minutesFromDayStart,
  nowInFestival,
} from '../lib/timetable'
import { useAsync } from '../lib/useAsync'

const HOUR_HEIGHT = 72 // 1시간 = 72px
const px = (minutes: number) => (minutes / 60) * HOUR_HEIGHT

const kindStyle = {
  lineup: 'bg-teal/90',
  experience: 'bg-pink',
}

export default function Timetable() {
  const timetable = useAsync(() => fetchTimetable(), [])

  return (
    <>
      <PageHeader title="Time Table" sub="타임테이블" />
      {timetable.status === 'loading' && <section className="p-4"><Placeholder>불러오는 중…</Placeholder></section>}
      {timetable.status === 'error' && (
        <section className="p-4">
          <Placeholder>타임테이블을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Placeholder>
        </section>
      )}
      {timetable.status === 'success' &&
        (timetable.data.performances.length === 0 ? (
          <section className="p-4"><Placeholder>아직 공개된 타임테이블이 없어요</Placeholder></section>
        ) : (
          <TimetableView {...timetable.data} />
        ))}
    </>
  )
}

function TimetableView({ stages, performances }: { stages: Stage[]; performances: Performance[] }) {
  const days = [...new Set(performances.map((p) => p.festival_day))]
  const now = useNow()

  // 선택한 날짜는 주소(?day=)에 저장 → 새로고침·공유해도 유지. 없으면 오늘(페스티벌 중일 때) 또는 첫날
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('day')
  const day = requested && days.includes(requested) ? requested : days.includes(now.day) ? now.day : days[0]

  const dayPerformances = performances.filter((p) => p.festival_day === day)

  return (
    <>
      {/* 날짜 버튼 */}
      <nav className="sticky top-[58px] z-20 flex gap-2 overflow-x-auto bg-paper/95 px-4 py-3 backdrop-blur">
        {days.map((d) => {
          const { date, weekday } = formatFestivalDay(d)
          return (
            <button
              key={d}
              type="button"
              onClick={() => setSearchParams({ day: d }, { replace: true })}
              className={`shrink-0 rounded-full border-2 border-ink px-3.5 py-1 font-display text-sm uppercase tracking-wide ${
                d === day ? 'bg-ink text-butter' : ''
              }`}
            >
              {date} {weekday}
            </button>
          )
        })}
      </nav>

      <DayGrid stages={stages} performances={dayPerformances} nowMinutes={now.day === day ? now.minutes : null} />
    </>
  )
}

function DayGrid({
  stages,
  performances,
  nowMinutes,
}: {
  stages: Stage[]
  performances: Performance[]
  nowMinutes: number | null
}) {
  // 그날 첫 공연 ~ 마지막 공연을 정시 단위로
  const starts = performances.map((p) => minutesFromDayStart(p.starts_at, p.festival_day))
  const ends = performances.map((p) => minutesFromDayStart(p.ends_at, p.festival_day))
  const gridStart = Math.floor(Math.min(...starts) / 60) * 60
  const gridEnd = Math.ceil(Math.max(...ends) / 60) * 60
  // 시작·끝 시각 눈금까지 포함
  const hours = Array.from({ length: (gridEnd - gridStart) / 60 + 1 }, (_, i) => gridStart + i * 60)

  const columns = `2.5rem repeat(${stages.length}, minmax(0, 1fr))`

  return (
    <section className="px-2 pb-6">
      {/* 스테이지 이름 (스크롤해도 날짜 버튼 아래 고정) */}
      <div
        className="sticky top-[114px] z-10 grid gap-1 border-b-2 border-ink bg-paper py-2"
        style={{ gridTemplateColumns: columns }}
      >
        <span />
        {stages.map((s) => (
          <span key={s.id} className="text-center font-display text-[13px] uppercase leading-tight tracking-wide">
            {s.name}
          </span>
        ))}
      </div>

      {/* 위아래 여백: 첫·마지막 시간 글자가 잘리지 않게 */}
      <div className="relative my-3 grid gap-1" style={{ gridTemplateColumns: columns, height: px(gridEnd - gridStart) }}>
        {/* 시간 눈금 */}
        <div className="relative">
          {hours.map((h) => (
            <span
              key={h}
              className="absolute right-1 -translate-y-1/2 text-[10px] font-semibold text-ink/50"
              style={{ top: px(h - gridStart) }}
            >
              {formatMinutes(h)}
            </span>
          ))}
        </div>

        {stages.map((stage) => (
          <div
            key={stage.id}
            className="relative rounded-md bg-ink/[0.03]"
            // 정시마다 가로줄
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, rgb(22 20 18 / 0.12) 0 1px, transparent 1px ${HOUR_HEIGHT}px)`,
            }}
          >
            {performances
              .filter((p) => p.stage_id === stage.id)
              .map((p) => (
                <PerformanceBlock key={p.id} performance={p} gridStart={gridStart} />
              ))}
          </div>
        ))}

        {/* 지금 시각 */}
        {nowMinutes !== null && nowMinutes >= gridStart && nowMinutes <= gridEnd && (
          <div
            className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
            style={{ top: px(nowMinutes - gridStart) }}
          >
            <span className="size-2 -translate-x-0.5 rounded-full bg-flare" />
            <span className="h-0.5 flex-1 bg-flare" />
          </div>
        )}
      </div>
    </section>
  )
}

function PerformanceBlock({ performance: p, gridStart }: { performance: Performance; gridStart: number }) {
  const start = minutesFromDayStart(p.starts_at, p.festival_day)
  const end = minutesFromDayStart(p.ends_at, p.festival_day)
  const short = end - start < 50 // 짧은 공연은 시간과 제목을 한 줄씩만

  const content = (
    <>
      <span className="block text-[9px] font-semibold leading-tight text-ink/70">
        {formatMinutes(start)}-{formatMinutes(end)}
      </span>
      <span className={`block break-keep text-[11px] font-bold leading-tight ${short ? 'line-clamp-1' : 'line-clamp-3'}`}>
        {p.title}
      </span>
      {!short && p.subtitle && (
        <span className="mt-0.5 block line-clamp-2 text-[9px] leading-tight text-ink/70">{p.subtitle}</span>
      )}
    </>
  )

  const className = `absolute inset-x-0 overflow-hidden rounded-md border-[1.5px] border-ink px-1 py-0.5 text-center ${kindStyle[p.kind]}`
  const style = { top: px(start - gridStart) + 1, height: px(end - start) - 2 }

  // 프로그램과 연결된 공연만 상세로 이동
  return p.program ? (
    <Link to={`/program/${p.program.category}/${p.program.id}`} className={`${className} active:brightness-95`} style={style}>
      {content}
    </Link>
  ) : (
    <div className={className} style={style}>
      {content}
    </div>
  )
}

// 1분마다 현재 시각 갱신 (빨간 줄 위치)
function useNow() {
  const [now, setNow] = useState(() => nowInFestival())
  useEffect(() => {
    const timer = setInterval(() => setNow(nowInFestival()), 60_000)
    return () => clearInterval(timer)
  }, [])
  return now
}
