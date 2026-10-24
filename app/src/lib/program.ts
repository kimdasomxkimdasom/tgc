import { supabase } from './supabase'

export const PROGRAM_CATEGORIES = [
  { key: 'lineup', en: 'Line Up', ko: '라인업' },
  { key: 'experience', en: 'Experience', ko: '익스피리언스' },
] as const

export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number]['key']

// 이미지가 없을 때 카드 배경색
export const programGradient: Record<ProgramCategory, string> = {
  lineup: 'from-pink via-butter to-teal',
  experience: 'from-teal to-sea',
}

export function isProgramCategory(value: string | undefined): value is ProgramCategory {
  return PROGRAM_CATEGORIES.some((c) => c.key === value)
}

export type ProgramSummary = {
  id: number
  category: ProgramCategory
  name: string
  name_en: string | null
  tagline: string | null
  image_url: string | null
}

export type Program = ProgramSummary & {
  description: string | null
  instagram: string | null
  youtube_url: string | null
  spotify_url: string | null
  apple_music_url: string | null
}

function db() {
  if (!supabase) throw new Error('.env에 Supabase 설정이 없어요')
  return supabase
}

export async function fetchPrograms(category: ProgramCategory): Promise<ProgramSummary[]> {
  const { data, error } = await db()
    .from('program')
    .select('id, category, name, name_en, tagline, image_url')
    .eq('category', category)
    .order('sort_order')
    .order('name')
  if (error) throw error
  return data
}

// 없으면 null
export async function fetchProgram(id: number): Promise<Program | null> {
  const { data, error } = await db()
    .from('program')
    .select('id, category, name, name_en, tagline, image_url, description, instagram, youtube_url, spotify_url, apple_music_url')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}
