import styles from '../css/Streak.module.css'

function Streak({ count }) {
	if (count === 0) return null

	return (
		<div className={styles.wrapper}>
			<div className={styles.icon}>🔥</div>
			<div className={styles.content}>
				<div className={styles.count}>{count}</div>
				<div className={styles.label}>
					{count === 1 ? 'день подряд' : count < 5 ? 'дня подряд' : 'дней подряд'}
				</div>
			</div>
		</div>
	)
}

export default Streak
