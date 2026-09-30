import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './components/Login'
import { useAuth } from './hooks/useAuth'
import GoalPage from './pages/GoalPage'
import Home from './pages/Home'

function App() {
	const { user, loading } = useAuth()

	useEffect(() => {
		const theme = localStorage.getItem('dream-jar-theme') || 'dark'
		document.documentElement.setAttribute('data-theme', theme)
	}, [])

	if (loading) {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
					fontSize: 20,
					color: '#9a9ab0',
				}}
			>
				Загрузка...
			</div>
		)
	}

	if (!user) {
		return <Login />
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home user={user} />} />
				<Route path='/goal/:id' element={<GoalPage user={user} />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
