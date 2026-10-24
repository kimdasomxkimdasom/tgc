import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Lineup from './pages/Lineup'
import Timetable from './pages/Timetable'
import PartnerListPage from './pages/PartnerListPage'
import PartnerDetailPage from './pages/PartnerDetailPage'
import SiteMap from './pages/SiteMap'
import More from './pages/More'
import NoticeListPage from './pages/NoticeListPage'
import NoticeDetailPage from './pages/NoticeDetailPage'
import FaqPage from './pages/FaqPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lineup" element={<Lineup />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="partners" element={<Navigate to="/partners/fnb" replace />} />
        <Route path="partners/:category" element={<PartnerListPage />} />
        <Route path="partners/:category/:id" element={<PartnerDetailPage />} />
        {/* 예전 주소 */}
        <Route path="food" element={<Navigate to="/partners/fnb" replace />} />
        <Route path="map" element={<SiteMap />} />
        <Route path="more" element={<More />} />
        {/* /more 아래에 두어서 하단 탭의 '더보기'가 계속 선택된 상태로 보이게 */}
        <Route path="more/notice" element={<NoticeListPage />} />
        <Route path="more/notice/:id" element={<NoticeDetailPage />} />
        <Route path="more/faq" element={<FaqPage />} />
      </Route>
    </Routes>
  )
}
