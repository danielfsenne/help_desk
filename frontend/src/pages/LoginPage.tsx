import { LifeBuoy } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../api/auth'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
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
      const { token, user } = await loginRequest(email, password)
      login(token, user)
      navigate('/dashboard')
    } catch {
      setError('Email ou senha inválidos')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-page px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center">
            <LifeBuoy size={24} strokeWidth={2.25} />
          </div>
          <h1 className="text-xl font-semibold text-ink">Help Desk</h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Email">
              <Input
                type="email"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </Field>

            <Field label="Senha">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            {error && <p className="text-sm text-priority-critical">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full mt-1">
              {submitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-ink-secondary mt-4">
          Não tem conta?{' '}
          <Link to="/register" className="text-brand-600 font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
