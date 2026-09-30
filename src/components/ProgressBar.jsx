import styles from '../css/GoalCard.module.css'

function ProgressBar({ percentage, isComplete, saved, target }) {
	const size = 140
	const strokeWidth = 8
	const radius = (size - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius
	const offset = circumference - (percentage / 100) * circumference

	return (
		<div className={styles.progressCircleWrapper}>
			<div className={styles.progressCircle}>
				<svg className={styles.progressCircleSvg} viewBox={`0 0 ${size} ${size}`}>
					<defs>
						<linearGradient id='progressGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
							<stop offset='0%' stopColor='#5a7fff' />
							<stop offset='100%' stopColor='#8b6cfc' />
						</linearGradient>
						<linearGradient id='completeGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
							<stop offset='0%' stopColor='#34c759' />
							<stop offset='100%' stopColor='#28a745' />
						</linearGradient>
					</defs>
					<circle
						className={styles.progressCircleBg}
						cx={size / 2}
						cy={size / 2}
						r={radius}
					/>
					<circle
						className={`${styles.progressCircleFill} ${isComplete ? styles.completeFill : ''}`}
						cx={size / 2}
						cy={size / 2}
						r={radius}
						strokeDasharray={circumference}
						strokeDashoffset={offset}
					/>
				</svg>
				<div className={styles.progressCircleContent}>
					<div className={`${styles.progressPercent} ${isComplete ? styles.completePercent : ''}`}>
						{percentage}%
					</div>
					<div className={styles.progressSubtext}>
						{isComplete ? 'готово' : 'прогресс'}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProgressBar