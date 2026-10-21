import { useEffect, useState } from 'react'
import Placeholder from '../components/Placeholder'
import Star from '../components/Star'
import { formatDate } from '../lib/date'
import { supabase } from '../lib/supabase'

type Notice = {
  id: number
  title: string
  is_pinned: boolean
  created_at: string
}

const TICKET_URL = 'https://thegratefulcamp.com/lookbook/list_basic.html?cate_no=25'

const tickets = [
  { name: ['General', 'Ticket'], sub: '관람권 예매하기', bg: 'from-sunset to-pink', star: 'text-pink' },
  { name: ['Camping', 'Ticket'], sub: '캠핑권 예매하기', bg: 'from-butter to-teal', star: 'text-paper' },
]

function SectionTitle({ en, ko }: { en: string; ko: string }) {
  return (
    <h2 className="mb-2 flex items-baseline gap-2">
      <span className="font-display text-xl uppercase tracking-wide">{en}</span>
      <span className="text-xs font-semibold text-ink/55">{ko}</span>
    </h2>
  )
}

// 고정 공지 먼저, 그다음 최신순으로 3개
function useRecentNotices() {
  const [notices, setNotices] = useState<Notice[] | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('notice')
      .select('id, title, is_pinned, created_at')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (error) console.error(error)
        setNotices(data ?? [])
      })
  }, [])

  return notices
}

function NoticeList() {
  const notices = useRecentNotices()

  if (!supabase) return <Placeholder>.env에 Supabase 설정이 없어요</Placeholder>
  if (notices === null) return <Placeholder>불러오는 중…</Placeholder>
  if (notices.length === 0) return <Placeholder>등록된 공지가 없어요</Placeholder>

  return (
    <ul className="divide-y divide-ink/10 rounded-2xl border-2 border-ink bg-white/60">
      {notices.map((n) => (
        <li key={n.id} className="flex items-center gap-2 px-4 py-3 text-sm">
          {n.is_pinned && (
            <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-butter">고정</span>
          )}
          <span className="truncate font-medium">{n.title}</span>
          <span className="ml-auto shrink-0 text-xs text-ink/45">{formatDate(n.created_at)}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  return (
    <div className="space-y-6 p-4">
      <section className="grain relative overflow-hidden rounded-3xl border-2 border-ink bg-ink px-5 pb-6 pt-7 text-paper">
        <Star className="absolute -right-8 -top-8 size-32 text-butter" />
        <Star className="absolute right-24 top-6 size-5 text-butter" />
        <Star className="absolute bottom-16 right-8 size-9 text-pink" />
        <Star className="absolute bottom-5 right-24 size-4 text-teal" />

        <p className="font-display text-lg tracking-[0.3em] text-butter">2026</p>
        <h1 className="logo-gradient mt-1 font-display text-[4.25rem] uppercase leading-[0.88]">
          The
          <br />
          Grateful
          <br />
          Camp
        </h1>
        <p className="mt-5 text-sm font-semibold">Be Grateful. Be Yourself.</p>
        <p className="mt-3 inline-block rounded-full border border-paper/40 px-3 py-1 text-xs text-paper/80">
          신안 짱뚱어해수욕장
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {tickets.map((t) => (
          <a
            key={t.sub}
            href={TICKET_URL}
            target="_blank"
            rel="noreferrer"
            className={`grain relative overflow-hidden rounded-2xl border-2 border-ink bg-gradient-to-b ${t.bg} p-4 shadow-[4px_4px_0_var(--color-ink)] transition active:translate-x-1 active:translate-y-1 active:shadow-none`}
          >
            <Star className={`absolute -bottom-6 -right-6 size-24 opacity-80 ${t.star}`} />
            <p className="relative font-display text-[1.7rem] uppercase leading-[0.95]">
              {t.name[0]}
              <br />
              {t.name[1]}
            </p>
            <p className="relative mt-3 text-xs font-bold">{t.sub} →</p>
          </a>
        ))}
      </section>

      <section>
        <SectionTitle en="Today" ko="오늘의 공연" />
        <Placeholder>지금 · 다음 공연이 들어갈 자리</Placeholder>
      </section>

      <section>
        <SectionTitle en="Notice" ko="공지사항" />
        <NoticeList />
      </section>
    </div>
  )
}
