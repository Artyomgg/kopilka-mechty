import { useEffect, useState } from 'react'
import styles from '../css/JarProgress.module.css'

function JarProgress({ percentage = 0, isComplete = false }) {
	// 🔥 Плавная анимация при изменении процента
	const [displayPercentage, setDisplayPercentage] = useState(0)

	useEffect(() => {
		const timer = setTimeout(() => {
			setDisplayPercentage(percentage)
		}, 100)
		return () => clearTimeout(timer)
	}, [percentage])

	// Банка: viewBox 200 x 240
	// Уровень жидкости: от y=200 (пусто) до y=60 (полно)
	const liquidTopY = 200 - (displayPercentage / 100) * 140

	return (
		<div className={`${styles.wrapper} ${isComplete ? styles.complete : ''}`}>
			<svg viewBox='0 0 200 240' className={styles.jar} preserveAspectRatio='xMidYMid meet'>
				<defs>
					{/* Градиент стекла */}
					<linearGradient id='glassGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
						<stop offset='0%' stopColor='rgba(255,255,255,0.15)' />
						<stop offset='50%' stopColor='rgba(255,255,255,0.05)' />
						<stop offset='100%' stopColor='rgba(255,255,255,0.15)' />
					</linearGradient>

					{/* Градиент жидкости */}
					<linearGradient id='liquidGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
						<stop offset='0%' stopColor='#5a7fff' stopOpacity='0.9' />
						<stop offset='100%' stopColor='#8b6cfc' stopOpacity='1' />
					</linearGradient>

					{/* Градиент для полной банки */}
					<linearGradient id='liquidComplete' x1='0%' y1='0%' x2='0%' y2='100%'>
						<stop offset='0%' stopColor='#34c759' stopOpacity='0.9' />
						<stop offset='100%' stopColor='#28a745' stopOpacity='1' />
					</linearGradient>

					{/* Блик на стекле */}
					<linearGradient id='shine' x1='0%' y1='0%' x2='100%' y2='0%'>
						<stop offset='0%' stopColor='rgba(255,255,255,0.4)' stopOpacity='0' />
						<stop offset='50%' stopColor='rgba(255,255,255,0.5)' stopOpacity='0.8' />
						<stop offset='100%' stopColor='rgba(255,255,255,0.4)' stopOpacity='0' />
					</linearGradient>

					{/* Обрезка жидкости по форме банки */}
					<clipPath id='jarClip'>
						<path
							d='M 40 60
							   L 40 200
							   Q 40 220, 60 220
							   L 140 220
							   Q 160 220, 160 200
							   L 160 60
							   Z'
						/>
					</clipPath>

					{/* Блик-анимация */}
					<linearGradient id='blinkGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
						<stop offset='0%' stopColor='rgba(255,255,255,0)' />
						<stop offset='50%' stopColor='rgba(255,255,255,0.6)' />
						<stop offset='100%' stopColor='rgba(255,255,255,0)' />
					</linearGradient>
				</defs>

				{/* ===== СТЕКЛО (банка) ===== */}
				<path
					d='M 40 60
					   L 40 200
					   Q 40 220, 60 220
					   L 140 220
					   Q 160 220, 160 200
					   L 160 60
					   Z'
					fill='url(#glassGradient)'
					stroke='rgba(255,255,255,0.25)'
					strokeWidth='2'
				/>

				{/* ===== ЖИДКОСТЬ (заполнение) ===== */}
				<g clipPath='url(#jarClip)'>
					{/* Прямоугольник — заполнение */}
					<rect
						x='40'
						y={liquidTopY}
						width='120'
						height={240 - liquidTopY}
						fill={isComplete ? 'url(#liquidComplete)' : 'url(#liquidGradient)'}
						style={{
							transition: 'y 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
						}}
					/>

					{/* Волна сверху жидкости */}
					<path
						d={`M 40 ${liquidTopY}
							Q 70 ${liquidTopY - 6}, 100 ${liquidTopY}
							Q 130 ${liquidTopY + 6}, 160 ${liquidTopY}
							L 160 ${liquidTopY + 12}
							L 40 ${liquidTopY + 12}
							Z`}
						fill={isComplete ? 'url(#liquidComplete)' : 'url(#liquidGradient)'}
						style={{
							transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
						}}
					>
						<animate
							attributeName='d'
							dur='3s'
							repeatCount='indefinite'
							values={`
								M 40 ${liquidTopY} Q 70 ${liquidTopY - 6}, 100 ${liquidTopY} Q 130 ${liquidTopY + 6}, 160 ${liquidTopY} L 160 ${liquidTopY + 12} L 40 ${liquidTopY + 12} Z;
								M 40 ${liquidTopY} Q 70 ${liquidTopY + 6}, 100 ${liquidTopY} Q 130 ${liquidTopY - 6}, 160 ${liquidTopY} L 160 ${liquidTopY + 12} L 40 ${liquidTopY + 12} Z;
								M 40 ${liquidTopY} Q 70 ${liquidTopY - 6}, 100 ${liquidTopY} Q 130 ${liquidTopY + 6}, 160 ${liquidTopY} L 160 ${liquidTopY + 12} L 40 ${liquidTopY + 12} Z
							`}
						/>
					</path>

					{/* Монетки (плавают) — только если есть заполнение */}
					{displayPercentage > 15 && (
						<>
							<circle
								cx='80'
								cy='190'
								r='7'
								fill='#ffd60a'
								stroke='#f59e0b'
								strokeWidth='1'
								opacity='0.85'
							>
								<animate
									attributeName='cy'
									dur='4s'
									repeatCount='indefinite'
									values='190;185;190'
								/>
							</circle>
							<circle
								cx='115'
								cy='200'
								r='6'
								fill='#ffd60a'
								stroke='#f59e0b'
								strokeWidth='1'
								opacity='0.85'
							>
								<animate
									attributeName='cy'
									dur='3.5s'
									repeatCount='indefinite'
									values='200;195;200'
								/>
							</circle>
						</>
					)}

					{displayPercentage > 40 && (
						<>
							<circle
								cx='95'
								cy='160'
								r='6'
								fill='#ffd60a'
								stroke='#f59e0b'
								strokeWidth='1'
								opacity='0.85'
							>
								<animate
									attributeName='cy'
									dur='4.5s'
									repeatCount='indefinite'
									values='160;155;160'
								/>
							</circle>
							<circle
								cx='130'
								cy='170'
								r='5'
								fill='#ffd60a'
								stroke='#f59e0b'
								strokeWidth='1'
								opacity='0.85'
							>
								<animate
									attributeName='cy'
									dur='3.8s'
									repeatCount='indefinite'
									values='170;165;170'
								/>
							</circle>
						</>
					)}

					{displayPercentage > 65 && (
						<circle
							cx='85'
							cy='120'
							r='5'
							fill='#ffd60a'
							stroke='#f59e0b'
							strokeWidth='1'
							opacity='0.85'
						>
							<animate attributeName='cy' dur='5s' repeatCount='indefinite' values='120;115;120' />
						</circle>
					)}

					{displayPercentage > 85 && (
						<circle
							cx='110'
							cy='90'
							r='5'
							fill='#ffd60a'
							stroke='#f59e0b'
							strokeWidth='1'
							opacity='0.85'
						>
							<animate attributeName='cy' dur='4.2s' repeatCount='indefinite' values='90;85;90' />
						</circle>
					)}
				</g>

				{/* ===== БЛИК НА СТЕКЛЕ ===== */}
				<path
					d='M 48 70 L 60 70 L 60 210 L 48 210 Z'
					fill='url(#shine)'
					opacity='0.4'
					clipPath='url(#jarClip)'
				/>

				{/* ===== ГОРЛЫШКО И КРЫШКА ===== */}
				{/* Горлышко */}
				<rect
					x='55'
					y='40'
					width='90'
					height='20'
					fill='rgba(255,255,255,0.1)'
					stroke='rgba(255,255,255,0.25)'
					strokeWidth='2'
					rx='4'
				/>

				{/* Крышка */}
				<rect
					x='50'
					y='25'
					width='100'
					height='18'
					fill={isComplete ? 'url(#liquidComplete)' : 'url(#liquidGradient)'}
					rx='6'
					stroke='rgba(255,255,255,0.3)'
					strokeWidth='1'
				/>

				{/* Полоски на крышке */}
				<line x1='58' y1='29' x2='58' y2='39' stroke='rgba(0,0,0,0.2)' strokeWidth='1' />
				<line x1='70' y1='29' x2='70' y2='39' stroke='rgba(0,0,0,0.2)' strokeWidth='1' />
				<line x1='82' y1='29' x2='82' y2='39' stroke='rgba(0,0,0,0.2)' strokeWidth='1' />
				<line x1='94' y1='29' x2='94' y2='39' stroke='rgba(0,0,0,0.2)' strokeWidth='1' />
				<line x1='106' y1='29' x2='106' y2='39' stroke='rgba(0,0,0,0.2)' strokeWidth='1' />
				<line x1='118' y1='29' x2='118' y2='39' stroke='rgba(0,0,0,0.2)' strokeWidth='1' />
				<line x1='130' y1='29' x2='130' y2='39' stroke='rgba(0,0,0,0.2)' strokeWidth='1' />
				<line x1='142' y1='29' x2='142' y2='39' stroke='rgba(0,0,0,0.2)' strokeWidth='1' />

				{/* ===== ПРОЦЕНТЫ В БАНКЕ ===== */}
				<text
					x='100'
					y='140'
					textAnchor='middle'
					className={styles.percentText}
					style={{ fontSize: '42px', fontWeight: 800 }}
				>
					{Math.round(displayPercentage)}%
				</text>

				{/* Иконка при 100% */}
				{isComplete && (
					<text x='100' y='175' textAnchor='middle' style={{ fontSize: '24px' }}>
						🎉
					</text>
				)}
			</svg>
		</div>
	)
}

export default JarProgress
