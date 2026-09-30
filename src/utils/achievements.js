// 🔥 Список всех ачивок
export const ACHIEVEMENTS = [
	{
		id: 'first_deposit',
		icon: '🎯',
		title: 'Первый шаг',
		description: 'Сделал первый взнос',
		check: ({ deposits }) => deposits.length >= 1,
	},
	{
		id: 'five_deposits',
		icon: '✋',
		title: 'Пять взносов',
		description: 'Внёс 5 взносов',
		check: ({ deposits }) => deposits.length >= 5,
	},
	{
		id: 'ten_deposits',
		icon: '🔟',
		title: 'Десятка',
		description: 'Внёс 10 взносов',
		check: ({ deposits }) => deposits.length >= 10,
	},
	{
		id: 'half_way',
		icon: '⚡',
		title: 'Половина пути',
		description: 'Накопил 50% от цели',
		check: ({ saved, target }) => target > 0 && saved / target >= 0.5,
	},
	{
		id: 'goal_complete',
		icon: '🎉',
		title: 'Мечта сбылась!',
		description: 'Достиг цели на 100%',
		check: ({ saved, target }) => target > 0 && saved >= target,
	},
	{
		id: 'hundred_rubles',
		icon: '💎',
		title: 'Первая сотня',
		description: 'Накопил 100 рублей',
		check: ({ saved }) => saved >= 100,
	},
	{
		id: 'streak_3',
		icon: '🔥',
		title: 'Три дня подряд',
		description: 'Вносил 3 дня подряд',
		check: ({ streak }) => streak >= 3,
	},
	{
		id: 'streak_7',
		icon: '🌟',
		title: 'Неделя силы',
		description: 'Вносил 7 дней подряд',
		check: ({ streak }) => streak >= 7,
	},
]

// 🔥 Проверить, какие ачивки открылись
export function checkAchievements({ goal, saved, streak, unlocked = [] }) {
	const deposits = goal.deposits || []
	const target = Number(goal.target_amount) || 0

	const context = {
		deposits,
		saved,
		target,
		streak,
	}

	return ACHIEVEMENTS.filter(a => !unlocked.includes(a.id) && a.check(context))
}

// 🔥 Посчитать серию дней (streak)
export function calculateStreak(deposits) {
	if (!deposits || deposits.length === 0) return 0

	// Группируем взносы по дате (YYYY-MM-DD)
	const dates = [
		...new Set(deposits.map(d => new Date(d.created_at).toISOString().slice(0, 10))),
	].sort((a, b) => new Date(b) - new Date(a)) // от новых к старым

	let streak = 0
	const today = new Date().toISOString().slice(0, 10)
	const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

	// Если сегодня или вчера был взнос — считаем серию
	if (dates[0] !== today && dates[0] !== yesterday) return 0

	let expected = dates[0]
	for (const date of dates) {
		if (date === expected) {
			streak++
			const prev = new Date(expected)
			prev.setDate(prev.getDate() - 1)
			expected = prev.toISOString().slice(0, 10)
		} else {
			break
		}
	}

	return streak
}
