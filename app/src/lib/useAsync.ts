// deps를 호출하는 쪽에서 넘기므로 린트가 의존성을 확인할 수 없어 이 파일만 규칙을 끔
/* oxlint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

// Promise를 돌려주는 함수를 실행하고 로딩/에러/성공 상태를 관리
// deps가 바뀌면 다시 불러옴 (예: 상세 화면에서 id가 바뀔 때)
export function useAsync<T>(load: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })

  useEffect(() => {
    let ignore = false // 응답이 오기 전에 화면을 떠나면 결과 무시
    setState({ status: 'loading' })
    load().then(
      (data) => !ignore && setState({ status: 'success', data }),
      (error: Error) => {
        console.error(error)
        if (!ignore) setState({ status: 'error', error })
      },
    )
    return () => {
      ignore = true
    }
  }, deps)

  return state
}
