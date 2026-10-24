import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import { type Faq, fetchFaqs } from '../lib/faq'
import { useAsync } from '../lib/useAsync'

const ALL = '전체'

export default function FaqPage() {
  const faqs = useAsync(() => fetchFaqs(), [])

  return (
    <>
      <PageHeader title="FAQ" sub="Q&A" back="/more" />
      {faqs.status === 'loading' && <section className="p-4"><Placeholder>불러오는 중…</Placeholder></section>}
      {faqs.status === 'error' && (
        <section className="p-4">
          <Placeholder>Q&A를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Placeholder>
        </section>
      )}
      {faqs.status === 'success' &&
        (faqs.data.length === 0 ? (
          <section className="p-4"><Placeholder>등록된 질문이 없어요</Placeholder></section>
        ) : (
          <FaqList faqs={faqs.data} />
        ))}
    </>
  )
}

function FaqList({ faqs }: { faqs: Faq[] }) {
  const [category, setCategory] = useState(ALL)
  // 데이터에 있는 카테고리로 필터 버튼 만들기 (처음 나온 순서대로)
  const categories = [ALL, ...new Set(faqs.map((f) => f.category))]
  const shown = category === ALL ? faqs : faqs.filter((f) => f.category === category)

  return (
    <>
      <nav className="flex gap-2 overflow-x-auto px-4 py-3">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full border-2 border-ink px-3.5 py-1 text-sm font-semibold ${
              c === category ? 'bg-ink text-butter' : ''
            }`}
          >
            {c}
          </button>
        ))}
      </nav>

      <ul className="space-y-2.5 px-4 pb-6">
        {shown.map((f) => (
          <li key={f.id}>
            {/* details/summary = 브라우저 기본 아코디언 (눌러서 펼치기) */}
            <details className="group overflow-hidden rounded-2xl border-2 border-ink bg-white/60">
              <summary className="flex cursor-pointer list-none items-start gap-2.5 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-lg leading-6 text-sunset">Q</span>
                <span className="flex-1 text-[15px] font-semibold leading-6">{f.question}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 size-5 shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="flex gap-2.5 border-t-2 border-dashed border-ink/15 bg-butter/25 px-4 py-3.5">
                <span className="font-display text-lg leading-6 text-teal">A</span>
                <p className="flex-1 whitespace-pre-line break-words text-sm leading-6">{f.answer}</p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </>
  )
}
