import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BottomSheet from '../components/BottomSheet'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import Star from '../components/Star'
import StarButton from '../components/StarButton'
import { useMyTimetable } from '../lib/myTimetable'
import {
  type Performance,
  type Stage,
  fetchTimetable,
  formatFestivalDay,
  formatMinutes,
  formatPerformanceTime,
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
  const my = useMyTimetable()
  const [selected, setSelected] = useState<Performance | null>(null)
  const closeSheet = useCallback(() => setSelected(null), [setSelected])

  // 날짜(?day=)와 MY 보기(?my=1)는 주소에 저장 → 새로고침·공유해도 유지
  // 날짜가 없으면 오늘(페스티벌 중일 때) 또는 첫날
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('day')
  const day = requested && days.includes(requested) ? requested : days.includes(now.day) ? now.day : days[0]
  const myOnly = searchParams.get('my') === '1'
  const setView = (nextDay: string, nextMyOnly: boolean) =>
    setSearchParams({ day: nextDay, ...(nextMyOnly && { my: '1' }) }, { replace: true })

  const dayPerformances = performances.filter((p) => p.festival_day === day)
  const savedToday = dayPerformances.filter((p) => my.has(p.id)).length

  return (
    <>
      {/* 날짜 버튼 + MY 보기 */}
      <nav className="sticky top-[58px] z-20 flex items-center gap-2 bg-paper/95 py-3 pl-4 pr-3 backdrop-blur">
        <div className="flex flex-1 gap-2 overflow-x-auto">
          {days.map((d) => {
            const { date, weekday } = formatFestivalDay(d)
            return (
              <button
                key={d}
                type="button"
                onClick={() => setView(d, myOnly)}
                className={`shrink-0 rounded-full border-2 border-ink px-3 py-1 font-display text-sm uppercase tracking-wide ${
                  d === day ? 'bg-ink text-butter' : ''
                }`}
              >
                {date} {weekday}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setView(day, !myOnly)}
          aria-pressed={myOnly}
          className={`flex shrink-0 items-center gap-1 rounded-full border-2 border-ink px-2.5 py-1 font-display text-sm uppercase tracking-wide ${
            myOnly ? 'bg-butter' : ''
          }`}
        >
          <Star className="size-3.5" />
          My
        </button>
      </nav>

      {myOnly && savedToday === 0 && (
        <p className="mx-4 mb-1 rounded-xl bg-butter/50 px-3 py-2 text-xs font-medium">
          이 날 저장한 공연이 없어요. 공연을 눌러 ☆를 저장해 보세요.
        </p>
      )}

      <DayGrid
        stages={stages}
        performances={dayPerformances}
        nowMinutes={now.day === day ? now.minutes : null}
        isSaved={my.has}
        myOnly={myOnly}
        onSelect={setSelected}
      />

      {selected && (
        <PerformanceSheet
          performance={selected}
          stage={stages.find((s) => s.id === selected.stage_id)}
          saved={my.has(selected.id)}
          onToggle={() => my.toggle(selected.id)}
          onClose={closeSheet}
        />
      )}
    </>
  )
}

function DayGrid({
  stages,
  performances,
  nowMinutes,
  isSaved,
  myOnly,
  onSelect,
}: {
  stages: Stage[]
  performances: Performance[]
  nowMinutes: number | null
  isSaved: (id: number) => boolean
  myOnly: boolean
  onSelect: (p: Performance) => void
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
                <PerformanceBlock
                  key={p.id}
                  performance={p}
                  gridStart={gridStart}
                  saved={isSaved(p.id)}
                  dimmed={myOnly && !isSaved(p.id)}
                  onSelect={() => onSelect(p)}
                />
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

function PerformanceBlock({
  performance: p,
  gridStart,
  saved,
  dimmed,
  onSelect,
}: {
  performance: Performance
  gridStart: number
  saved: boolean
  dimmed: boolean
  onSelect: () => void
}) {
  const start = minutesFromDayStart(p.starts_at, p.festival_day)
  const end = minutesFromDayStart(p.ends_at, p.festival_day)
  const short = end - start < 50 // 짧은 공연은 시간과 제목을 한 줄씩만

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`absolute inset-x-0 overflow-hidden rounded-md px-1 py-0.5 text-center transition active:brightness-95 ${
        kindStyle[p.kind]
      } ${saved ? 'border-[2.5px] border-ink shadow-[2px_2px_0_var(--color-ink)]' : 'border-[1.5px] border-ink'} ${
        dimmed ? 'opacity-25' : ''
      }`}
      style={{ top: px(start - gridStart) + 1, height: px(end - start) - 2 }}
    >
      {saved && <Star className="absolute right-0.5 top-0.5 size-3 text-ink" />}
      <span className="block text-[9px] font-semibold leading-tight text-ink/70">
        {formatMinutes(start)}-{formatMinutes(end)}
      </span>
      <span className={`block break-keep text-[11px] font-bold leading-tight ${short ? 'line-clamp-1' : 'line-clamp-3'}`}>
        {p.title}
      </span>
      {!short && p.subtitle && (
        <span className="mt-0.5 block line-clamp-2 text-[9px] leading-tight text-ink/70">{p.subtitle}</span>
      )}
    </button>
  )
}

// 공연을 누르면 올라오는 창: 정보 + 저장 + 프로그램 상세로
function PerformanceSheet({
  performance: p,
  stage,
  saved,
  onToggle,
  onClose,
}: {
  performance: Performance
  stage: Stage | undefined
  saved: boolean
  onToggle: () => void
  onClose: () => void
}) {
  const { date, weekday } = formatFestivalDay(p.festival_day)

  return (
    <BottomSheet onClose={onClose}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm uppercase tracking-wide text-ink/60">
            {date} {weekday} · {formatPerformanceTime(p)} · {stage?.name}
          </p>
          <h2 className="mt-1 text-xl font-bold leading-snug">{p.title}</h2>
          {p.subtitle && <p className="mt-0.5 text-sm text-ink/60">{p.subtitle}</p>}
        </div>
        <StarButton saved={saved} onToggle={onToggle} className="size-12 shrink-0" />
      </div>

      <p className="mt-3 text-xs font-medium text-ink/50">
        {saved ? '내 타임테이블에 저장됨 · 별을 다시 누르면 빠져요' : '별을 누르면 내 타임테이블에 저장돼요'}
      </p>

      {p.program && (
        <Link
          to={`/program/${p.program.category}/${p.program.id}`}
          className="mt-4 flex items-center justify-center rounded-2xl border-2 border-ink bg-white/60 py-3 text-sm font-bold active:bg-butter/40"
        >
          {p.kind === 'lineup' ? '아티스트 정보 보기' : '프로그램 정보 보기'} →
        </Link>
      )}
    </BottomSheet>
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
