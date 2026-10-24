import { supabase } from './supabase'

export type Faq = {
  id: number
  category: string
  question: string
  answer: string
}

// 정렬 순서대로 (숨김 처리된 질문은 RLS가 걸러줌)
export async function fetchFaqs(): Promise<Faq[]> {
  if (!supabase) throw new Error('.env에 Supabase 설정이 없어요')
  const { data, error } = await supabase
    .from('faq')
    .select('id, category, question, answer')
    .order('sort_order')
    .order('id')
  if (error) throw error
  return data
}
