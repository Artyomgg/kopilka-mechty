import { useState } from 'react'
import styles from '../css/Login.module.css'
import { useAuth } from '../hooks/useAuth'

function Login() {
	const [email, setEmail] = useState('')
	const [sent, setSent] = useState(false)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { signInWithEmail } = useAuth()

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			await signInWithEmail(email.trim().toLowerCase())
			setSent(true)
		} catch (err) {
			setError(err.message || 'Ошибка входа')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<div className={styles.icon}>🏆</div>
				<h1>Копилка мечты</h1>

				{sent ? (
					<div className={styles.success}>
						<div style={{ fontSize: 48, marginBottom: 12 }}>📩</div>
						<h2>Проверь почту!</h2>
						<p>
							Мы отправили ссылку для входа на <strong>{email}</strong>. Перейди по ней, чтобы
							войти.
						</p>
						<button className={styles.btnLink} onClick={() => setSent(false)}>
							← Ввести другой email
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className={styles.form}>
						<p className={styles.subtitle}>Введи email — мы отправим ссылку для входа</p>

						{error && <div className={styles.error}>{error}</div>}

						<input
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder='твой@email.com'
							required
							autoFocus
						/>

						<button type='submit' disabled={loading} className={styles.btn}>
							{loading ? 'Отправка...' : 'Войти'}
						</button>
					</form>
				)}
			</div>
		</div>
	)
}

export default Login
