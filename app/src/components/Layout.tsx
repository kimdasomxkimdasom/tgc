import { Outlet } from 'react-router-dom'
import TabBar from './TabBar'

// 모바일 화면 폭(최대 480px)을 기준으로 가운데 정렬
export default function Layout() {
  return (
    <div className="mx-auto flex h-full max-w-[480px] flex-col bg-paper shadow-2xl">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
