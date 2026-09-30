import styles from '../css/AchievementsList.module.css'
import { ACHIEVEMENTS } from '../utils/achievements'

function AchievementsList({ unlocked = [] }) {
	if (unlocked.length === 0) return null

	return (
		<div className={styles.wrapper}>
			{ACHIEVEMENTS.map(a => {
				const isUnlocked = unlocked.includes(a.id)
				return (
					<div
						key={a.id}
						className={`${styles.badge} ${isUnlocked ? styles.unlocked : styles.locked}`}
						title={a.description}
					>
						<span className={styles.icon}>{isUnlocked ? a.icon : '🔒'}</span>
					</div>
				)
			})}
		</div>
	)
}

export default AchievementsList
