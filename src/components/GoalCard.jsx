import confetti from 'canvas-confetti'
import { useEffect, useRef, useState } from 'react'
import styles from '../css/GoalCard.module.css'
import { calculateStreak } from '../utils/achievements'
import AchievementsList from './AchievementsList'
import DepositForm from './DepositForm'
import GoalChart from './GoalChart'
import Heatmap from './Heatmap'
import ProgressBar from './ProgressBar'
import ShareButton from './ShareButton'
import Streak from './Streak'

function GoalCard({ goal, onDelete, onAddDeposit, unlockedAchievements = [] }) {
	const [showDeposit, setShowDeposit] = useState(false)
	const [showHistory, setShowHistory] = useState(false)
	const cardRef = useRef(null)
	const prevComplete = useRef(false)

	const deposits = goal.deposits || []
	const saved = deposits.reduce((sum, d) => sum + Number(d.amount), 0)
	const target = Number(goal.target_amount)
	const percentage = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0
	const remaining = Math.max(0, target - saved)
	const isComplete = saved >= target && target > 0
	const streak = calculateStreak(deposits)

	// 🎉 Конфетти при достижении цели
	useEffect(() => {
		if (isComplete && !prevComplete.current) {
			confetti({
				particleCount: 200,
				spread: 100,
				origin: { y: 0.5 },
				colors: ['#34c759', '#5a7fff', '#8b6cfc', '#ffd60a'],
			})
		}
		prevComplete.current = isComplete
	}, [isComplete])

	const getForecast = () => {
		if (saved === 0 || deposits.length === 0 || isComplete) return null
		const firstDate = new Date(deposits[0].created_at)
		const now = new Date()
		const daysPassed = Math.max(1, (now - firstDate) / (1000 * 60 * 60 * 24))
		const avgPerDay = saved / daysPassed
		if (avgPerDay <= 0) return null
		const daysLeft = Math.ceil(remaining / avgPerDay)
		return { daysLeft, avgPerDay: avgPerDay.toFixed(2) }
	}

	const forecast = getForecast()

	return (
		<div ref={cardRef} className={`${styles.card} ${isComplete ? styles.complete : ''}`}>
			{/* ===== ЛЕВАЯ ЧАСТЬ: ФОТО ===== */}
			<div className={styles.imageSection}>
				{goal.image_url ? (
					<img src={goal.image_url} alt={goal.title} className={styles.image} />
				) : (
					<div className={styles.imagePlaceholder}>{isComplete ? '🎉' : '🎯'}</div>
				)}
				{isComplete && <div className={styles.completeBadge}>🎉 Готово!</div>}
			</div>

			{/* ===== ПРАВАЯ ЧАСТЬ: ИНФО ===== */}
			<div className={styles.content}>
				{/* Заголовок */}
				<div className={styles.titleRow}>
					<h3 className={styles.title}>{goal.title}</h3>
					<button className={styles.btnDelete} onClick={onDelete} title='Удалить'>
						🗑
					</button>
				</div>

				{/* Streak */}
				{streak > 0 && (
					<div className={styles.streakWrapper}>
						<Streak count={streak} />
					</div>
				)}

				{/* Прогресс-кольцо + суммы + прогноз */}
				<div className={styles.progressSection}>
					<ProgressBar
						percentage={percentage}
						isComplete={isComplete}
						saved={saved}
						target={target}
					/>

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
							<span className={`${styles.amountValue} ${isComplete ? styles.amountComplete : ''}`}>
								{remaining.toFixed(2)} руб
							</span>
						</div>
						{forecast && (
							<div className={styles.amountRow}>
								<span className={styles.amountLabel}>Прогноз</span>
								<span className={styles.amountValueAccent}>{forecast.daysLeft} дн.</span>
							</div>
						)}
					</div>
				</div>

				{/* Дедлайн */}
				{goal.deadline && (
					<div className={styles.deadline}>
						📅 До {new Date(goal.deadline).toLocaleDateString('ru-RU')}
					</div>
				)}

				{/* Ачивки */}
				<AchievementsList unlocked={unlockedAchievements} />

				{/* Статистика */}
				{deposits.length > 1 && (
					<div className={styles.stats}>
						<Heatmap deposits={deposits} weeks={13} />
						<GoalChart deposits={deposits} target={target} />
					</div>
				)}

				{/* Действия */}
				<div className={styles.actions}>
					<button
						className={styles.btnDeposit}
						onClick={() => setShowDeposit(!showDeposit)}
						disabled={isComplete}
					>
						💰 {showDeposit ? 'Отмена' : 'Добавить взнос'}
					</button>

					{deposits.length > 0 && (
						<button className={styles.btnSecondary} onClick={() => setShowHistory(!showHistory)}>
							📋 {showHistory ? 'Скрыть' : `История (${deposits.length})`}
						</button>
					)}

					{deposits.length > 0 && <ShareButton goalRef={cardRef} goalTitle={goal.title} />}
				</div>

				{/* Форма взноса */}
				{showDeposit && (
					<DepositForm
						onSubmit={async (amount, note) => {
							try {
								await onAddDeposit(goal.id, amount, note)
								setShowDeposit(false)
							} catch (err) {
								alert('Ошибка: ' + err.message)
							}
						}}
						onCancel={() => setShowDeposit(false)}
					/>
				)}

				{/* История */}
				{showHistory && deposits.length > 0 && (
					<div className={styles.history}>
						{[...deposits]
							.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
							.map(d => (
								<div key={d.id} className={styles.historyItem}>
									<div>
										<strong>+{Number(d.amount).toFixed(2)} руб</strong>
										{d.note && <span className={styles.note}> — {d.note}</span>}
									</div>
									<small>{new Date(d.created_at).toLocaleDateString('ru-RU')}</small>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	)
}

export default GoalCard
