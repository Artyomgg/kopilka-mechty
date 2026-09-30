import { useState } from 'react'
import styles from '../css/Form.module.css'

function WithdrawForm({ saved, onSubmit, onCancel }) {
	const [amount, setAmount] = useState('')
	const [note, setNote] = useState('')
	const [saving, setSaving] = useState(false)

	const quickAmounts = [5, 10, 20, 50]

	const handleSubmit = async e => {
		e.preventDefault()
		const num = Number(amount)
		if (!num || num <= 0) {
			alert('Введите сумму')
			return
		}
		if (num > saved) {
			alert(`Нельзя снять больше, чем накоплено (${saved.toFixed(2)} руб)`)
			return
		}

		setSaving(true)
		try {
			// 🔥 Отправляем отрицательную сумму
			await onSubmit(-num, note.trim() || 'Снятие')
		} catch (err) {
			console.error(err)
		} finally {
			setSaving(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className={styles.depositForm}>
			<div className={styles.withdrawHeader}>
				<span className={styles.withdrawIcon}>💸</span>
				<span>
					Доступно к снятию: <strong>{saved.toFixed(2)} руб</strong>
				</span>
			</div>

			<div className={styles.quickAmounts}>
				{quickAmounts.map(q => (
					<button
						key={q}
						type='button'
						className={styles.quickBtn}
						onClick={() => setAmount(String(q))}
						disabled={q > saved}
					>
						{q} руб
					</button>
				))}
				<button type='button' className={styles.quickBtn} onClick={() => setAmount(String(saved))}>
					Всё
				</button>
			</div>

			<input
				type='number'
				value={amount}
				onChange={e => setAmount(e.target.value)}
				placeholder='Сумма снятия'
				min='0.01'
				step='0.01'
				max={saved}
				autoFocus
				required
			/>

			<input
				type='text'
				value={note}
				onChange={e => setNote(e.target.value)}
				placeholder='Зачем снимаешь? (необязательно)'
			/>

			<div className={styles.depositActions}>
				<button type='button' className={styles.btnSecondary} onClick={onCancel} disabled={saving}>
					Отмена
				</button>
				<button type='submit' className={styles.btnWithdraw} disabled={saving}>
					{saving ? '...' : '💸 Снять'}
				</button>
			</div>
		</form>
	)
}

export default WithdrawForm
