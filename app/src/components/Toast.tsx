import { useEffect, useState } from 'react'

// 화면 아래쪽에 잠깐 떴다 사라지는 안내 문구
// 브라우저 기본 alert 대신 사용 (디자인 통일 + 화면을 막지 않음)
export function useToast(duration = 2000) {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(null), duration)
    return () => clearTimeout(timer)
  }, [message, duration])

  const toast = message && (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4"
    >
      <p className="rounded-full border-2 border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-butter shadow-lg">
        {message}
      </p>
    </div>
  )

  return { show: setMessage, toast }
}
