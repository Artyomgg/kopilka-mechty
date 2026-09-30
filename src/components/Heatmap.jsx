import styles from '../css/Heatmap.module.css'

function Heatmap({ deposits = [], weeks = 13 }) {
	// Группируем взносы по дням
	const depositMap = {}
	deposits.forEach(d => {
		const day = new Date(d.created_at).toISOString().slice(0, 10)
		depositMap[day] = (depositMap[day] || 0) + Number(d.amount)
	})

	// Максимум за день (для шкалы)
	const maxAmount = Math.max(1, ...Object.values(depositMap))

	// Генерируем сетку: weeks × 7 дней
	const days = []
	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const totalDays = weeks * 7
	for (let i = totalDays - 1; i >= 0; i--) {
		const date = new Date(today)
		date.setDate(date.getDate() - i)
		const key = date.toISOString().slice(0, 10)
		const amount = depositMap[key] || 0

		// Уровень: 0-4
		let level = 0
		if (amount > 0) {
			const ratio = amount / maxAmount
			if (ratio <= 0.25) level = 1
			else if (ratio <= 0.5) level = 2
			else if (ratio <= 0.75) level = 3
			else level = 4
		}

		days.push({ date, key, amount, level })
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<span className={styles.title}>📅 Активность</span>
				<span className={styles.legend}>
					<span>меньше</span>
					{[0, 1, 2, 3, 4].map(l => (
						<span key={l} className={`${styles.cell} ${styles[`level${l}`]}`} />
					))}
					<span>больше</span>
				</span>
			</div>
			<div className={styles.grid}>
				{days.map(day => (
					<div
						key={day.key}
						className={`${styles.cell} ${styles[`level${day.level}`]}`}
						title={`${day.date.toLocaleDateString('ru-RU')}: ${day.amount.toFixed(2)} руб`}
					/>
				))}
			</div>
		</div>
	)
}

export default Heatmap
