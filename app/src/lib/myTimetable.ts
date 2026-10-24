import { useSyncExternalStore } from 'react'

// 내 타임테이블 = 저장한 공연 id 목록
// 지금은 이 기기(localStorage)에만 저장. 로그인 생기면 Supabase로 동기화 (ROADMAP 4단계)
// 저장소 접근은 이 파일에서만 → 앱 전환 때 네이티브 저장소로 바꾸기 쉽게 (TECH_DECISIONS "앱 전환 방식")
const KEY = 'tgc:my-timetable'

function read(): number[] {
  try {
    const ids: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(ids) ? ids.filter((id): id is number => typeof id === 'number') : []
  } catch {
    return [] // 시크릿 모드 등 저장소를 못 쓰는 경우
  }
}

let ids = read()
const listeners = new Set<() => void>()

function save(next: number[]) {
  ids = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // 저장 실패해도 이번 접속 동안은 화면에 반영
  }
  listeners.forEach((notify) => notify())
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  // 다른 탭에서 바꾼 것도 반영
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      ids = read()
      notify()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(notify)
    window.removeEventListener('storage', onStorage)
  }
}

// 여러 화면(타임테이블, 프로그램 상세)에서 써도 같은 목록을 공유
export function useMyTimetable() {
  const saved = useSyncExternalStore(subscribe, () => ids)
  return {
    saved,
    has: (id: number) => saved.includes(id),
    toggle: (id: number) => save(saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id]),
  }
}
