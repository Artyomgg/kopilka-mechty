import confetti from 'canvas-confetti'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import AchievementsList from '../components/AchievementsList'
import DepositForm from '../components/DepositForm'
import EditGoalForm from '../components/EditGoalForm'
import GoalChart from '../components/GoalChart'
import Heatmap from '../components/Heatmap'
import JarProgress from '../components/JarProgress'
import ShareButton from '../components/ShareButton'
import Streak from '../components/Streak'
import WithdrawForm from '../components/WithdrawForm'
import styles from '../css/GoalPage.module.css'
import { useGoals } from '../hooks/useGoals'
import { calculateStreak } from '../utils/achievements'

function GoalPage({ user }) {
	const { id } = useParams()
	const navigate = useNavigate()

	const { goals, loading, addDeposit, updateGoal, deleteGoal, getUnlockedAchievements } = useGoals(
		user?.id,
	)

	const [goal, setGoal] = useState(null)
	const [showDeposit, setShowDeposit] = useState(false)
	const [showWithdraw, setShowWithdraw] = useState(false)
	const [showEdit, setShowEdit] = useState(false)
	const [showHistory, setShowHistory] = useState(false)
	const cardRef = useRef(null)
	const prevComplete = useRef(false)

	useEffect(() => {
		if (!loading && goals.length > 0) {
			const found = goals.find(g => String(g.id) === String(id))
			if (found) setGoal(found)
		}
	}, [goals, loading, id])

	const deposits = goal?.deposits || []
	const saved = deposits.reduce((sum, d) => sum + Number(d.amount), 0)
	const target = Number(goal?.target_amount || 0)
	const percentage = target > 0 ? Math.min(100, Math.max(0, Math.round((saved / target) * 100))) : 0
	const remaining = Math.max(0, target - saved)
	const isComplete = saved >= target && target > 0
	const streak = calculateStreak(deposits)

	useEffect(() => {
		if (isComplete && !prevComplete.current) {
			confetti({
				particleCount: 250,
				spread: 120,
				origin: { y: 0.5 },
				colors: ['#34c759', '#5a7fff', '#8b6cfc', '#ffd60a'],
			})
		}
		prevComplete.current = isComplete
	}, [isComplete])

	const handleDelete = async () => {
		if (!window.confirm('Удалить эту цель?')) return
		try {
			await deleteGoal(goal.id)
			navigate('/')
		} catch (err) {
			alert('Ошибка удаления: ' + err.message)
		}
	}

	const handleSaveEdit = async updates => {
		try {
			await updateGoal(goal.id, updates)
			setShowEdit(false)
		} catch (err) {
			alert('Ошибка сохранения: ' + err.message)
		}
	}

	const handleWithdraw = async (negativeAmount, note) => {
		try {
			await addDeposit(goal.id, negativeAmount, note)
			setShowWithdraw(false)
		} catch (err) {
			alert('Ошибка: ' + err.message)
		}
	}

	if (loading) {
		return (
			<div className={styles.page}>
				<div className={styles.loading}>⏳ Загрузка...</div>
			</div>
		)
	}

	if (!goal) {
		return (
			<div className={styles.page}>
				<div className={styles.notFound}>
					<div style={{ fontSize: 64 }}>🔍</div>
					<h2>Цель не найдена</h2>
					<button className={styles.btnBack} onClick={() => navigate('/')}>
						← Вернуться
					</button>
				</div>
			</div>
		)
	}

	const getForecast = () => {
		if (saved === 0 || deposits.length === 0 || isComplete) return null
		const firstDate = new Date(deposits[0].created_at)
		const now = new Date()
		const daysPassed = Math.max(1, (now - firstDate) / (1000 * 60 * 60 * 24))
		const avgPerDay = saved / daysPassed
		if (avgPerDay <= 0) return null
		return {
			daysLeft: Math.ceil(remaining / avgPerDay),
			avgPerDay: avgPerDay.toFixed(2),
		}
	}
	const forecast = getForecast()

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<button className={styles.btnBack} onClick={() => navigate('/')}>
					← Назад
				</button>
				<div className={styles.headerActions}>
					<button
						className={styles.btnSecondary}
						onClick={() => setShowEdit(true)}
						title='Редактировать'
					>
						✏️ Редактировать
					</button>
					<ShareButton goalRef={cardRef} goalTitle={goal.title} />
					<button className={styles.btnDanger} onClick={handleDelete}>
						🗑 Удалить
					</button>
				</div>
			</header>

			<div ref={cardRef} className={`${styles.card} ${isComplete ? styles.complete : ''}`}>
				<div className={styles.imageSection}>
					{goal.image_url ? (
						<img src={goal.image_url} alt={goal.title} className={styles.image} />
					) : (
						<div className={styles.imagePlaceholder}>{isComplete ? '🎉' : '🎯'}</div>
					)}
					{isComplete && <div className={styles.completeBadge}>🎉 Готово!</div>}
				</div>

				<div className={styles.content}>
					<h1 className={styles.title}>{goal.title}</h1>

					{streak > 0 && <Streak count={streak} />}

					{goal.deadline && (
						<div className={styles.deadline}>
							📅 До {new Date(goal.deadline).toLocaleDateString('ru-RU')}
						</div>
					)}

					{/* Прогресс-банка + суммы */}
					<div className={styles.progressSection}>
						<JarProgress percentage={percentage} isComplete={isComplete} />

						<div className={styles.amounts}>
							<div className={styles.amountRow}>
								<span className={styles.amountLabel}>Накоплено</span>
								<span className={styles.amountValue}>{saved.toFixed(2)} руб</span>
							</div>
							<div className={styles.amountRow}>
								<span className={styles.amountLabel}>Цель</span>
								<span className={styles.amountValue}>{target.toFixed(2)} руб</span>
							</div>
							<div className={styles.amountRow}>
								<span className={styles.amountLabel}>Осталось</span>
								<span
									className={`${styles.amountValue} ${isComplete ? styles.amountComplete : ''}`}
								>
									{remaining.toFixed(2)} руб
								</span>
							</div>
							{forecast && (
								<>
									<div className={styles.amountRow}>
										<span className={styles.amountLabel}>Прогноз</span>
										<span className={styles.amountValueAccent}>{forecast.daysLeft} дн.</span>
									</div>
									<div className={styles.amountRow}>
										<span className={styles.amountLabel}>Средний взнос</span>
										<span className={styles.amountValue}>{forecast.avgPerDay} руб/день</span>
									</div>
								</>
							)}
						</div>
					</div>

					<AchievementsList unlocked={getUnlockedAchievements(goal.id)} />

					{deposits.length > 1 && (
						<div className={styles.stats}>
							<Heatmap deposits={deposits} weeks={13} />
							<GoalChart deposits={deposits} target={target} />
						</div>
					)}

					{/* 🔥 Действия */}
					<div className={styles.actions}>
						<button
							className={styles.btnPrimary}
							onClick={() => {
								setShowWithdraw(false)
								setShowDeposit(!showDeposit)
							}}
							disabled={isComplete}
						>
							💰 {showDeposit ? 'Отмена' : 'Добавить взнос'}
						</button>

						{saved > 0 && (
							<button
								className={styles.btnWithdraw}
								onClick={() => {
									setShowDeposit(false)
									setShowWithdraw(!showWithdraw)
								}}
							>
								💸 {showWithdraw ? 'Отмена' : 'Снять'}
							</button>
						)}

						{deposits.length > 0 && (
							<button className={styles.btnSecondary} onClick={() => setShowHistory(!showHistory)}>
								📋 {showHistory ? 'Скрыть' : `История (${deposits.length})`}
							</button>
						)}
					</div>

					{/* Форма взноса */}
					{showDeposit && (
						<DepositForm
							onSubmit={async (amount, note) => {
								try {
									await addDeposit(goal.id, amount, note)
									setShowDeposit(false)
								} catch (err) {
									alert('Ошибка: ' + err.message)
								}
							}}
							onCancel={() => setShowDeposit(false)}
						/>
					)}

					{/* Форма снятия */}
					{showWithdraw && (
						<WithdrawForm
							saved={saved}
							onSubmit={handleWithdraw}
							onCancel={() => setShowWithdraw(false)}
						/>
					)}

					{/* История */}
					{showHistory && deposits.length > 0 && (
						<div className={styles.history}>
							{[...deposits]
								.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
								.map(d => {
									const amt = Number(d.amount)
									const isNegative = amt < 0
									return (
										<div key={d.id} className={styles.historyItem}>
											<div>
												<strong className={isNegative ? styles.negative : ''}>
													{isNegative ? '' : '+'}
													{amt.toFixed(2)} руб
												</strong>
												{d.note && <span className={styles.note}> — {d.note}</span>}
											</div>
											<small>{new Date(d.created_at).toLocaleDateString('ru-RU')}</small>
										</div>
									)
								})}
						</div>
					)}
				</div>
			</div>

			{/* Модалка редактирования */}
			{showEdit && (
				<EditGoalForm goal={goal} onSave={handleSaveEdit} onClose={() => setShowEdit(false)} />
			)}
		</div>
	)
}

export default GoalPage
