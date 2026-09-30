import html2canvas from 'html2canvas'
import { useState } from 'react'
import { FaShare } from 'react-icons/fa'
import styles from '../css/ShareButton.module.css'

function ShareButton({ goalRef, goalTitle }) {
	const [generating, setGenerating] = useState(false)

	const handleShare = async () => {
		if (!goalRef?.current) return
		setGenerating(true)

		try {
			const canvas = await html2canvas(goalRef.current, {
				backgroundColor: '#0a0a14',
				scale: 2,
				logging: false,
			})

			canvas.toBlob(async blob => {
				const file = new File(
					[blob],
					`dream-jar-${goalTitle.toLowerCase().replace(/\s+/g, '-')}.png`,
					{ type: 'image/png' },
				)

				// Если поддерживается Web Share API — делимся файлом
				if (navigator.share && navigator.canShare?.({ files: [file] })) {
					try {
						await navigator.share({
							files: [file],
							title: `Копилка мечты: ${goalTitle}`,
							text: 'Смотри, как я коплю на мечту!',
						})
						return
					} catch (e) {
						// Пользователь отменил шаринг
					}
				}

				// Иначе — скачиваем
				const url = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				link.download = `dream-jar-${goalTitle}.png`
				link.click()
				URL.revokeObjectURL(url)
			})
		} catch (err) {
			console.error('Ошибка экспорта:', err)
			alert('Не удалось создать картинку')
		} finally {
			setGenerating(false)
		}
	}

	return (
		<button className={styles.btn} onClick={handleShare} disabled={generating} title='Поделиться'>
			<FaShare />
			{generating ? '...' : 'Поделиться'}
		</button>
	)
}

export default ShareButton
