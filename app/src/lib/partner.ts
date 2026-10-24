import { supabase } from './supabase'

export const PARTNER_CATEGORIES = [
  { key: 'fnb', en: 'F&B', ko: '먹거리' },
  { key: 'activity', en: 'Activity', ko: '액티비티' },
  { key: 'seller', en: 'Seller', ko: '셀러' },
] as const

export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number]['key']

// 이미지가 없을 때 카드 배경색
export const partnerGradient: Record<PartnerCategory, string> = {
  fnb: 'from-sunset to-pink',
  activity: 'from-butter to-teal',
  seller: 'from-pink to-butter',
}

export function isPartnerCategory(value: string | undefined): value is PartnerCategory {
  return PARTNER_CATEGORIES.some((c) => c.key === value)
}

export type PartnerSummary = {
  id: number
  category: PartnerCategory
  name: string
  name_en: string | null
  image_url: string | null
}

export type Partner = PartnerSummary & {
  instagram: string | null
  description: string | null
}

function db() {
  if (!supabase) throw new Error('.env에 Supabase 설정이 없어요')
  return supabase
}

export async function fetchPartners(category: PartnerCategory): Promise<PartnerSummary[]> {
  const { data, error } = await db()
    .from('partner')
    .select('id, category, name, name_en, image_url')
    .eq('category', category)
    .order('sort_order')
    .order('name')
  if (error) throw error
  return data
}

// 없으면 null
export async function fetchPartner(id: number): Promise<Partner | null> {
  const { data, error } = await db()
    .from('partner')
    .select('id, category, name, name_en, image_url, instagram, description')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}
