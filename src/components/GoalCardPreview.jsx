import { useNavigate } from 'react-router'
import styles from '../css/GoalCardPreview.module.css'

function GoalCardPreview({ goal }) {
	const navigate = useNavigate()

	const deposits = goal.deposits || []
	const saved = deposits.reduce((sum, d) => sum + Number(d.amount), 0)
	const target = Number(goal.target_amount)
	// 🔥 Защита от отрицательного процента (если снял больше, чем внёс)
	const percentage = target > 0 ? Math.min(100, Math.max(0, Math.round((saved / target) * 100))) : 0
	const isComplete = saved >= target && target > 0
	const isNegative = saved < 0

	const handleClick = () => {
		navigate(`/goal/${goal.id}`)
	}

	return (
		<div
			className={`${styles.card} ${isComplete ? styles.complete : ''} ${
				isNegative ? styles.negative : ''
			}`}
			onClick={handleClick}
		>
			{/* Фото */}
			<div className={styles.imageWrapper}>
				{goal.image_url ? (
					<img src={goal.image_url} alt={goal.title} className={styles.image} />
				) : (
					<div className={styles.imagePlaceholder}>{isComplete ? '🎉' : '🎯'}</div>
				)}
				{isComplete && <div className={styles.completeBadge}>🎉</div>}
				<div className={`${styles.percentageBadge} ${isComplete ? styles.percentageComplete : ''}`}>
					{percentage}%
				</div>
			</div>

			{/* Инфа */}
			<div className={styles.body}>
				<h3 className={styles.title}>{goal.title}</h3>

				<div className={styles.amounts}>
					<div className={`${styles.amountValue} ${isNegative ? styles.amountNegative : ''}`}>
						{saved.toFixed(2)} руб
					</div>
					<div className={styles.amountLabel}>из {target.toFixed(2)} руб</div>
				</div>

				{/* Мини-прогресс */}
				<div className={styles.progressBar}>
					<div
						className={`${styles.progressFill} ${isComplete ? styles.progressComplete : ''}`}
						style={{ width: `${percentage}%` }}
					/>
				</div>
			</div>
		</div>
	)
}

export default GoalCardPreview
