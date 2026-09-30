import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { calculateStreak, checkAchievements } from '../utils/achievements'

export function useGoals(userId) {
	const [goals, setGoals] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [newAchievement, setNewAchievement] = useState(null)

	const fetchGoals = useCallback(async () => {
		if (!userId) {
			setGoals([])
			setLoading(false)
			return
		}

		setLoading(true)
		try {
			const { data, error } = await supabase
				.from('goals')
				.select(`*, deposits (*)`)
				.eq('user_id', userId)
				.order('created_at', { ascending: false })

			if (error) throw error
			setGoals(data || [])
		} catch (err) {
			console.error('❌ Ошибка загрузки:', err)
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}, [userId])

	useEffect(() => {
		fetchGoals()
	}, [fetchGoals])

	const getUnlockedAchievements = goalId => {
		const saved = localStorage.getItem(`achievements-${goalId}`)
		return saved ? JSON.parse(saved) : []
	}

	const saveAchievement = (goalId, achievementId) => {
		const unlocked = getUnlockedAchievements(goalId)
		if (!unlocked.includes(achievementId)) {
			localStorage.setItem(`achievements-${goalId}`, JSON.stringify([...unlocked, achievementId]))
		}
	}

	const addGoal = async goalData => {
		try {
			const { data, error } = await supabase
				.from('goals')
				.insert({
					user_id: userId,
					title: goalData.title,
					target_amount: Number(goalData.target_amount),
					image_url: goalData.image_url || '',
					deadline: goalData.deadline || null,
				})
				.select()
				.single()

			if (error) throw error
			const newGoal = { ...data, deposits: [] }
			setGoals(prev => [newGoal, ...prev])
			return newGoal
		} catch (err) {
			console.error('❌ Ошибка создания:', err)
			throw err
		}
	}

	// 🔥 НОВОЕ: обновление цели
	const updateGoal = async (goalId, updates) => {
		try {
			const { data, error } = await supabase
				.from('goals')
				.update({
					title: updates.title,
					target_amount: Number(updates.target_amount),
					image_url: updates.image_url || '',
					deadline: updates.deadline || null,
				})
				.eq('id', goalId)
				.select()
				.single()

			if (error) throw error

			// Обновляем локально, сохраняя deposits
			setGoals(prev =>
				prev.map(g => (g.id === goalId ? { ...g, ...data, deposits: g.deposits } : g)),
			)
			return data
		} catch (err) {
			console.error('❌ Ошибка обновления:', err)
			throw err
		}
	}

	const deleteGoal = async goalId => {
		try {
			const { error } = await supabase.from('goals').delete().eq('id', goalId)
			if (error) throw error
			setGoals(prev => prev.filter(g => g.id !== goalId))
			localStorage.removeItem(`achievements-${goalId}`)
		} catch (err) {
			console.error('❌ Ошибка удаления:', err)
			throw err
		}
	}

	// 🔥 addDeposit теперь принимает и отрицательные суммы
	const addDeposit = async (goalId, amount, note) => {
		try {
			const { data, error } = await supabase
				.from('deposits')
				.insert({
					goal_id: goalId,
					user_id: userId,
					amount: Number(amount), // может быть отрицательным!
					note: note || '',
				})
				.select()
				.single()

			if (error) throw error

			// Проверяем ачивки только для положительных взносов
			if (Number(amount) > 0) {
				const goal = goals.find(g => g.id === goalId)
				if (goal) {
					const newDeposits = [...(goal.deposits || []), data]
					const saved = newDeposits.reduce((s, d) => s + Number(d.amount), 0)
					const streak = calculateStreak(newDeposits)
					const unlocked = getUnlockedAchievements(goalId)

					const newlyUnlocked = checkAchievements({
						goal: { ...goal, deposits: newDeposits },
						saved,
						streak,
						unlocked,
					})

					if (newlyUnlocked.length > 0) {
						const first = newlyUnlocked[0]
						newlyUnlocked.forEach(a => saveAchievement(goalId, a.id))
						setNewAchievement(first)
					}
				}
			}

			setGoals(prev =>
				prev.map(g => (g.id === goalId ? { ...g, deposits: [...(g.deposits || []), data] } : g)),
			)
			return data
		} catch (err) {
			console.error('❌ Ошибка взноса:', err)
			throw err
		}
	}

	return {
		goals,
		loading,
		error,
		addGoal,
		updateGoal, // 🔥 новое
		deleteGoal,
		addDeposit,
		refetch: fetchGoals,
		newAchievement,
		clearAchievement: () => setNewAchievement(null),
		getUnlockedAchievements,
	}
}
