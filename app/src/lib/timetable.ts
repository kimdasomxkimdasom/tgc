import type { ProgramCategory } from './program'
import { supabase } from './supabase'

export type Stage = {
  id: number
  name: string
}

export type Performance = {
  id: number
  festival_day: string // '2026-09-05'
  stage_id: number
  kind: ProgramCategory
  title: string
  subtitle: string | null
  starts_at: string
  ends_at: string
  program: { id: number; category: ProgramCategory } | null
}

function db() {
  if (!supabase) throw new Error('.env에 Supabase 설정이 없어요')
  return supabase
}

const performanceColumns = 'id, festival_day, stage_id, kind, title, subtitle, starts_at, ends_at, program(id, category)'

export async function fetchTimetable(): Promise<{ stages: Stage[]; performances: Performance[] }> {
  const [stages, performances] = await Promise.all([
    db().from('stage').select('id, name').order('sort_order'),
    db().from('performance').select(performanceColumns).order('starts_at'),
  ])
  if (stages.error) throw stages.error
  if (performances.error) throw performances.error
  return { stages: stages.data, performances: performances.data as unknown as Performance[] }
}

// 프로그램 상세의 공연 일정
export async function fetchProgramPerformances(programId: number): Promise<(Performance & { stage: Stage })[]> {
  const { data, error } = await db()
    .from('performance')
    .select(`${performanceColumns}, stage(id, name)`)
    .eq('program_id', programId)
    .order('starts_at')
  if (error) throw error
  return data as unknown as (Performance & { stage: Stage })[]
}

// --- 시간 계산: 포스터처럼 공연 날 0시 기준 분 단위 (자정 넘으면 24:00, 25:00 …) ---

// festival_day 0시(한국 시간)부터 몇 분 지났는지
export function minutesFromDayStart(iso: string, festivalDay: string) {
  const dayStart = new Date(`${festivalDay}T00:00:00+09:00`).getTime()
  return Math.round((new Date(iso).getTime() - dayStart) / 60000)
}

// 1530 → "25:30"
export function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatPerformanceTime(p: Pick<Performance, 'starts_at' | 'ends_at' | 'festival_day'>) {
  return `${formatMinutes(minutesFromDayStart(p.starts_at, p.festival_day))} - ${formatMinutes(minutesFromDayStart(p.ends_at, p.festival_day))}`
}

// '2026-09-05' → { date: '9/5', weekday: 'SAT' }
export function formatFestivalDay(day: string) {
  const d = new Date(`${day}T12:00:00+09:00`)
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', weekday: 'short' }).format(d).toUpperCase()
  const [, month, date] = day.split('-').map(Number)
  return { date: `${month}/${date}`, weekday }
}

// 지금이 어느 festival_day의 몇 분인지 (새벽 6시 전이면 전날 공연으로 침)
export function nowInFestival(now = new Date()) {
  const kst = new Date(now.getTime() + 9 * 3600_000)
  const hours = kst.getUTCHours()
  const day = new Date(kst.getTime() - (hours < 6 ? 24 * 3600_000 : 0)).toISOString().slice(0, 10)
  return { day, minutes: minutesFromDayStart(now.toISOString(), day) }
}
