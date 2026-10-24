import { supabase } from './supabase'

export type NoticeSummary = {
  id: number
  title: string
  is_pinned: boolean
  created_at: string
}

export type Notice = NoticeSummary & {
  content: string
}

function db() {
  if (!supabase) throw new Error('.env에 Supabase 설정이 없어요')
  return supabase
}

// 고정 공지 먼저, 그다음 최신순 (숨김 공지는 RLS가 걸러줌)
export async function fetchNotices(limit?: number): Promise<NoticeSummary[]> {
  let query = db()
    .from('notice')
    .select('id, title, is_pinned, created_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw error
  return data
}

// 없거나 숨김 처리된 공지면 null
export async function fetchNotice(id: number): Promise<Notice | null> {
  const { data, error } = await db()
    .from('notice')
    .select('id, title, content, is_pinned, created_at')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}
