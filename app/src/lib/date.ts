// DB의 timestamptz(UTC)를 한국 시간으로 표시 — notes/TECH_DECISIONS.md "DB 규칙" 참고
const kst = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', ...options })

const shortDate = kst({ month: '2-digit', day: '2-digit' })
const fullDate = kst({ year: 'numeric', month: '2-digit', day: '2-digit' })

// "2026. 10. 22." → "2026.10.22"
const tidy = (s: string) => s.replace(/\.\s?/g, '.').replace(/\.$/, '')

// 10.22
export function formatDate(iso: string) {
  return tidy(shortDate.format(new Date(iso)))
}

// 2026.10.22
export function formatFullDate(iso: string) {
  return tidy(fullDate.format(new Date(iso)))
}
