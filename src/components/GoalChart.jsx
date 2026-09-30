import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import styles from '../css/GoalChart.module.css'

function GoalChart({ deposits = [], target }) {
	if (deposits.length < 2) return null

	// Строим накопительный график
	const sorted = [...deposits].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

	let cumulative = 0
	const data = sorted.map(d => {
		cumulative += Number(d.amount)
		return {
			date: new Date(d.created_at).toLocaleDateString('ru-RU', {
				day: '2-digit',
				month: '2-digit',
			}),
			amount: Number(cumulative.toFixed(2)),
		}
	})

	// Добавляем целевую линию
	const targetValue = Number(target)

	return (
		<div className={styles.wrapper}>
			<div className={styles.title}>📈 Динамика накоплений</div>
			<div className={styles.chart}>
				<ResponsiveContainer width='100%' height={180}>
					<LineChart data={data}>
						<CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
						<XAxis
							dataKey='date'
							stroke='#6a6a88'
							tick={{ fontSize: 11 }}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							stroke='#6a6a88'
							tick={{ fontSize: 11 }}
							axisLine={false}
							tickLine={false}
							width={40}
						/>
						<Tooltip
							contentStyle={{
								background: 'rgba(26, 26, 46, 0.95)',
								border: '1px solid rgba(90, 127, 255, 0.3)',
								borderRadius: 8,
								color: '#f1f1f6',
								fontSize: 13,
							}}
							formatter={value => [`${value} руб`, 'Накоплено']}
						/>
						<Line
							type='monotone'
							dataKey='amount'
							stroke='url(#lineGradient)'
							strokeWidth={3}
							dot={{ fill: '#5a7fff', r: 4 }}
							activeDot={{ r: 6, fill: '#8b6cfc' }}
						/>
						<defs>
							<linearGradient id='lineGradient' x1='0' y1='0' x2='1' y2='0'>
								<stop offset='0%' stopColor='#5a7fff' />
								<stop offset='100%' stopColor='#8b6cfc' />
							</linearGradient>
						</defs>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

export default GoalChart
