import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Lineup from './pages/Lineup'
import Timetable from './pages/Timetable'
import Food from './pages/Food'
import SiteMap from './pages/SiteMap'
import More from './pages/More'

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
      </Route>
    </Routes>
  )
}
