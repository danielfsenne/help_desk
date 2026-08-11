import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { currentUser, logout } = useAuth()

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Olá, {currentUser?.name}</h1>
        <button onClick={logout}>Sair</button>
      </header>
      <p>Lista de chamados em construção.</p>
    </div>
  )
}
