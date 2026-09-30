import { useState } from 'react'
import styles from '../css/Form.module.css'

function DepositForm({ onSubmit, onCancel }) {
	const [amount, setAmount] = useState('')
	const [note, setNote] = useState('')
	const [saving, setSaving] = useState(false)

	const quickAmounts = [5, 10, 20, 50, 100]

	const handleSubmit = async e => {
		e.preventDefault()
		const num = Number(amount)
		if (!num || num <= 0) {
			alert('Введите сумму')
			return
		}

		setSaving(true)
		try {
			await onSubmit(num, note.trim())
		} catch (err) {
			console.error(err)
		} finally {
			setSaving(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className={styles.depositForm}>
			<div className={styles.quickAmounts}>
				{quickAmounts.map(q => (
					<button
						key={q}
						type='button'
						className={styles.quickBtn}
						onClick={() => setAmount(String(q))}
					>
						{q} руб
					</button>
				))}
			</div>

			<input
				type='number'
				value={amount}
				onChange={e => setAmount(e.target.value)}
				placeholder='Сумма'
				min='0.01'
				step='0.01'
				autoFocus
				required
			/>

			<input
				type='text'
				value={note}
				onChange={e => setNote(e.target.value)}
				placeholder='Заметка (необязательно)'
			/>

			<div className={styles.depositActions}>
				<button type='button' className={styles.btnSecondary} onClick={onCancel} disabled={saving}>
					Отмена
				</button>
				<button type='submit' className={styles.btnPrimary} disabled={saving}>
					{saving ? '...' : '+ Внести'}
				</button>
			</div>
		</form>
	)
}

export default DepositForm
