import confetti from 'canvas-confetti'
import { useEffect, useState } from 'react'
import styles from '../css/Achievement.module.css'

function AchievementModal({ achievement, onClose }) {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		setVisible(true)
		// 🎉 Конфетти
		confetti({
			particleCount: 120,
			spread: 90,
			origin: { y: 0.6 },
			colors: ['#5a7fff', '#8b6cfc', '#ffd60a', '#34c759'],
		})

		// Автозакрытие через 4 секунды
		const timer = setTimeout(() => {
			handleClose()
		}, 4000)

		return () => clearTimeout(timer)
	}, [])

	const handleClose = () => {
		setVisible(false)
		setTimeout(onClose, 300)
	}

	return (
		<div className={`${styles.overlay} ${visible ? styles.visible : ''}`} onClick={handleClose}>
			<div className={styles.modal} onClick={e => e.stopPropagation()}>
				<div className={styles.glow} />
				<div className={styles.icon}>{achievement.icon}</div>
				<div className={styles.label}>🏆 Новая ачивка!</div>
				<h2 className={styles.title}>{achievement.title}</h2>
				<p className={styles.description}>{achievement.description}</p>
			</div>
		</div>
	)
}

export default AchievementModal
