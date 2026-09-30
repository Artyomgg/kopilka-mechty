import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error(
		'❌ Не найдены VITE_SUPABASE_URL или VITE_SUPABASE_PUBLISHABLE_KEY. Проверь .env.local',
	)
}

export const supabase = createClient(supabaseUrl, supabaseKey)
