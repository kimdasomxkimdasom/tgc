import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '홈', icon: <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /> },
  {
    to: '/lineup',
    label: '라인업',
    icon: (
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </>
    ),
  },
  {
    to: '/timetable',
    label: '타임테이블',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  { to: '/food', label: '푸드', icon: <path d="M7 3v18M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3M17 21V3c-2 0-3.5 2.5-3.5 5.5S15 13 17 13" /> },
  { to: '/map', label: '맵', icon: <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /> },
  { to: '/more', label: '더보기', icon: <path d="M4 7h16M4 12h16M4 17h16" /> },
]

export default function TabBar() {
  return (
    <nav className="grid grid-cols-6 bg-ink pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-2.5 text-[11px] ${
              isActive ? 'font-bold text-butter' : 'text-paper/50'
            }`
          }
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {tab.icon}
          </svg>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
