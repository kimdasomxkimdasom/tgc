import { useNavigate } from 'react-router-dom'
import Star from './Star'

// 영문 대문자 제목(Anton) + 한글 부제
// back: 뒤로가기 버튼과, 링크로 바로 들어와 이전 화면이 없을 때 갈 주소
export default function PageHeader({ title, sub, back }: { title: string; sub?: string; back?: string }) {
  const navigate = useNavigate()

  // react-router가 history.state.idx에 앱 안에서 이동한 횟수를 기록함 (0이면 첫 화면)
  const goBack = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate(back!, { replace: true }))

  return (
    <header className="sticky top-0 z-10 flex items-end gap-2 border-b-2 border-ink bg-paper/95 px-4 pb-2.5 pt-4 backdrop-blur">
      {back && (
        <button
          type="button"
          onClick={goBack}
          aria-label="뒤로가기"
          className="-ml-1 self-center rounded-full p-1 active:bg-ink/10"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      )}
      <h1 className="font-display text-3xl uppercase leading-none tracking-wide">{title}</h1>
      {sub && <p className="pb-0.5 text-xs font-semibold text-ink/55">{sub}</p>}
      <Star className="ml-auto size-5 self-center text-sunset" />
    </header>
  )
}
