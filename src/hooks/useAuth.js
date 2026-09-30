import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export function useAuth() {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Проверяем, есть ли активная сессия
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null)
			setLoading(false)
		})

		// Слушаем изменения авторизации
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
		})

		return () => subscription.unsubscribe()
	}, [])

	// 🔥 Вход по email (магическая ссылка)
	const signInWithEmail = async email => {
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: window.location.origin,
			},
		})
		if (error) throw error
	}

	// 🔥 Выход
	const signOut = async () => {
		await supabase.auth.signOut()
		setUser(null)
	}

	return { user, loading, signInWithEmail, signOut }
}
