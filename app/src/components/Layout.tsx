import { useEffect } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import TabBar from './TabBar'

// 모바일 화면 폭(최대 480px)을 기준으로 가운데 정렬
// 페이지 전체(window)가 스크롤되어야 모바일 브라우저 주소창·하단바가 스크롤할 때 접힘
export default function Layout() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  // 새 화면으로 이동하면 맨 위부터 (뒤로가기는 브라우저가 위치 복원)
  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] bg-paper shadow-2xl">
      {/* 하단 탭바(고정)에 내용이 가리지 않게 탭바 높이만큼 여백 */}
      <main className="pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
