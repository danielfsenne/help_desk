import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginRequest, register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(name, email, password)
      const { token, user } = await loginRequest(email, password)
      login(token, user)
      navigate('/dashboard')
    } catch {
      setError('Não foi possível criar a conta. O email já pode estar em uso.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>Criar conta</h1>
      <p style={{ color: '#666', fontSize: 14 }}>Cadastro disponível para clientes.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        <input
          type="password"
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ padding: 8 }}
        />

        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        <button type="submit" disabled={submitting} style={{ padding: 8 }}>
          {submitting ? 'Criando...' : 'Criar conta'}
        </button>
      </form>

      <p style={{ fontSize: 14, marginTop: 16 }}>
        Já tem conta? <Link to="/">Entrar</Link>
      </p>
    </div>
  )
}
