import { useEffect } from 'react'

// 화면 아래에서 올라오는 창. 바깥(어두운 부분)을 누르거나 Esc로 닫힘
export default function BottomSheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[480px] rounded-t-3xl border-2 border-b-0 border-ink bg-paper px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink/20" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}
