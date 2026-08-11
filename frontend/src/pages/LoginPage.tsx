import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listUsers } from '../api/users'
import { useAuth } from '../context/AuthContext'
import type { User } from '../types'

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch(() => setError('Não foi possível carregar os usuários. O backend está rodando?'))
  }, [])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const user = users.find((u) => String(u.id) === selectedId)
    if (!user) {
      setError('Selecione um usuário')
      return
    }
    login(user)
    navigate('/dashboard')
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>Help Desk</h1>
      <p style={{ color: '#666', fontSize: 14 }}>
        Login provisório: escolha um usuário cadastrado. A autenticação por senha (JWT) entra na V2.
      </p>

      <form onSubmit={handleSubmit}>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        >
          <option value="">Selecione um usuário</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} — {user.role}
            </option>
          ))}
        </select>

        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        <button type="submit" style={{ width: '100%', padding: 8 }}>
          Entrar
        </button>
      </form>
    </div>
  )
}
