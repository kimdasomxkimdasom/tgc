// DB의 timestamptz(UTC)를 한국 시간으로 표시 — notes/TECH_DECISIONS.md "DB 규칙" 참고
const kstDate = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: '2-digit',
  day: '2-digit',
})

export function formatDate(iso: string) {
  return kstDate.format(new Date(iso)).replace(/\.\s?/g, '.').replace(/\.$/, '')
}
