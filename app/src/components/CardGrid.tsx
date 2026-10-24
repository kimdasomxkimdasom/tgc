import { Link } from 'react-router-dom'
import CoverImage from './CoverImage'

export type CardItem = {
  id: number
  name: string
  name_en: string | null
  image_url: string | null
}

// 이미지 + 이름 2열 카드 목록 (파트너스, 프로그램)
export default function CardGrid({
  items,
  linkTo,
  gradient,
}: {
  items: CardItem[]
  linkTo: (item: CardItem) => string
  gradient: string
}) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            to={linkTo(item)}
            className="block overflow-hidden rounded-2xl border-2 border-ink bg-white/60 active:translate-y-0.5"
          >
            <CoverImage
              src={item.image_url}
              name={item.name}
              initial={item.name_en ?? item.name}
              gradient={gradient}
              className="aspect-square w-full border-b-2 border-ink text-4xl"
            />
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-bold">{item.name}</p>
              {/* 영문 이름이 없거나 한글과 같아도 줄은 남겨서 카드 높이 맞추기 */}
              <p className="truncate text-[11px] uppercase text-ink/50">
                {item.name_en && item.name_en !== item.name ? item.name_en : ' '}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
