import { useState } from 'react'
import styles from '../css/Form.module.css'

function GoalForm({ onSave, onClose }) {
	const [form, setForm] = useState({
		title: '',
		target_amount: '',
		image_url: '',
		deadline: '',
	})
	const [saving, setSaving] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()

		if (!form.title.trim()) {
			alert('Введите название цели')
			return
		}
		if (!form.target_amount || Number(form.target_amount) <= 0) {
			alert('Введите сумму цели')
			return
		}

		setSaving(true)
		try {
			await onSave({
				title: form.title.trim(),
				target_amount: Number(form.target_amount),
				image_url: form.image_url.trim(),
				deadline: form.deadline || null,
			})
		} catch (err) {
			alert('Ошибка: ' + err.message)
		} finally {
			setSaving(false)
		}
	}

	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modal} onClick={e => e.stopPropagation()}>
				<div className={styles.modalHeader}>
					<h2>🎯 Новая цель</h2>
					<button className={styles.modalClose} onClick={onClose}>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.formGroup}>
						<label>Название мечты *</label>
						<input
							type='text'
							value={form.title}
							onChange={e => setForm({ ...form, title: e.target.value })}
							placeholder='Например: Наушники Sony'
							autoFocus
							required
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Сколько нужно накопить (руб) *</label>
						<input
							type='number'
							value={form.target_amount}
							onChange={e => setForm({ ...form, target_amount: e.target.value })}
							placeholder='300'
							min='1'
							step='0.01'
							required
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Ссылка на фото (необязательно)</label>
						<input
							type='url'
							value={form.image_url}
							onChange={e => setForm({ ...form, image_url: e.target.value })}
							placeholder='https://example.com/image.jpg'
						/>
					</div>

					<div className={styles.formGroup}>
						<label>К какому сроку (необязательно)</label>
						<input
							type='date'
							value={form.deadline}
							onChange={e => setForm({ ...form, deadline: e.target.value })}
						/>
					</div>

					<div className={styles.formActions}>
						<button
							type='button'
							className={styles.btnSecondary}
							onClick={onClose}
							disabled={saving}
						>
							Отмена
						</button>
						<button type='submit' className={styles.btnPrimary} disabled={saving}>
							{saving ? 'Создание...' : 'Создать цель'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default GoalForm
