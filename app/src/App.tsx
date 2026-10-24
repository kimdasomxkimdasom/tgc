import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Lineup from './pages/Lineup'
import Timetable from './pages/Timetable'
import Food from './pages/Food'
import SiteMap from './pages/SiteMap'
import More from './pages/More'
import NoticeListPage from './pages/NoticeListPage'
import NoticeDetailPage from './pages/NoticeDetailPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lineup" element={<Lineup />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="food" element={<Food />} />
        <Route path="map" element={<SiteMap />} />
        <Route path="more" element={<More />} />
        {/* /more 아래에 두어서 하단 탭의 '더보기'가 계속 선택된 상태로 보이게 */}
        <Route path="more/notice" element={<NoticeListPage />} />
        <Route path="more/notice/:id" element={<NoticeDetailPage />} />
      </Route>
    </Routes>
  )
}
