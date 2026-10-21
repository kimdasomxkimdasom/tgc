import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// .env 설정 전에는 null — 화면 개발은 Supabase 없이도 가능
export const supabase = url && anonKey ? createClient(url, anonKey) : null
