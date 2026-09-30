import { useState } from 'react'
import AchievementModal from '../components/AchievementModal'
import GoalCardPreview from '../components/GoalCardPreview'
import GoalForm from '../components/GoalForm'
import styles from '../css/Home.module.css'
import { useGoals } from '../hooks/useGoals'
import { supabase } from '../supabase'

function Home({ user }) {
	const [showForm, setShowForm] = useState(false)
	const {
		goals,
		loading,
		addGoal,
		deleteGoal,
		addDeposit,
		newAchievement,
		clearAchievement,
		getUnlockedAchievements,
	} = useGoals(user?.id)

	const [theme, setTheme] = useState(() => {
		return localStorage.getItem('dream-jar-theme') || 'dark'
	})

	const toggleTheme = () => {
		const next = theme === 'dark' ? 'light' : 'dark'
		setTheme(next)
		document.documentElement.setAttribute('data-theme', next)
		localStorage.setItem('dream-jar-theme', next)
	}

	const totalSaved = goals.reduce(
		(sum, g) => sum + (g.deposits || []).reduce((s, d) => s + Number(d.amount), 0),
		0,
	)
	const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0)

	const handleLogout = async () => {
		if (!window.confirm('Выйти из аккаунта?')) return
		await supabase.auth.signOut()
	}

	const handleAddGoal = async goalData => {
		await addGoal(goalData)
		setShowForm(false)
	}

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.headerLeft}>
					<div className={styles.logoIcon}>🏆</div>
					<div>
						<h1>Копилка мечты</h1>
						<p>{user?.email || 'Копи на то, что важно'}</p>
					</div>
				</div>

				<div className={styles.headerActions}>
					<button className={styles.themeToggle} onClick={toggleTheme}>
						{theme === 'dark' ? '☀️' : '🌙'}
					</button>
					<button className={styles.themeToggle} onClick={handleLogout} title='Выйти'>
						🚪
					</button>
					<button className={styles.btnPrimary} onClick={() => setShowForm(true)}>
						+ Новая цель
					</button>
				</div>
			</header>

			{goals.length > 0 && (
				<div className={styles.statsGrid}>
					<div className={styles.statCard}>
						<div className={styles.statIcon}>🎯</div>
						<div>
							<div className={styles.statValue}>{goals.length}</div>
							<div className={styles.statLabel}>Целей</div>
						</div>
					</div>
					<div className={styles.statCard}>
						<div className={styles.statIcon}>💰</div>
						<div>
							<div className={styles.statValue}>{totalSaved.toFixed(2)} руб</div>
							<div className={styles.statLabel}>Накоплено</div>
						</div>
					</div>
					<div className={styles.statCard}>
						<div className={styles.statIcon}>🏁</div>
						<div>
							<div className={styles.statValue}>{totalTarget.toFixed(2)} руб</div>
							<div className={styles.statLabel}>Всего целей</div>
						</div>
					</div>
				</div>
			)}

			{loading ? (
				<div className={styles.emptyState}>
					<div className={styles.emptyIcon}>⏳</div>
					<h2>Загрузка...</h2>
				</div>
			) : goals.length === 0 ? (
				<div className={styles.emptyState}>
					<div className={styles.emptyIcon}>🎯</div>
					<h2>Пока нет целей</h2>
					<p>Создай первую мечту, на которую хочешь накопить</p>
					<button className={styles.btnPrimary} onClick={() => setShowForm(true)}>
						+ Создать цель
					</button>
				</div>
			) : (
				<div className={styles.goalsGrid}>
					{goals.map(goal => (
						<GoalCardPreview key={goal.id} goal={goal} />
					))}
				</div>
			)}

			{showForm && <GoalForm onSave={handleAddGoal} onClose={() => setShowForm(false)} />}

			{newAchievement && (
				<AchievementModal achievement={newAchievement} onClose={clearAchievement} />
			)}
		</div>
	)
}

export default Home
