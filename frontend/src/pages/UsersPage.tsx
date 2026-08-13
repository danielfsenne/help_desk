import { Plus, Users as UsersIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createUser, listUsers } from '../api/users'
import AppShell from '../components/AppShell'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import PageHeader from '../components/ui/PageHeader'
import Select from '../components/ui/Select'
import type { Role, User } from '../types'

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  ATTENDANT: 'Atendente',
  CLIENT: 'Cliente',
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('ATTENDANT')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function reload() {
    listUsers()
      .then(setUsers)
      .catch(() => setError('Não foi possível carregar os usuários.'))
      .finally(() => setLoading(false))
  }

  useEffect(reload, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await createUser({ name, email, password, role })
      setName('')
      setEmail('')
      setPassword('')
      setRole('ATTENDANT')
      reload()
    } catch {
      setError('Não foi possível criar o usuário. Verifique se o email já está em uso.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <PageHeader title="Usuários" subtitle="Cadastre atendentes e administradores" />

        <Card className="p-4 mb-6">
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3">
            <Field label="Nome">
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Email">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field label="Senha">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </Field>
            <Field label="Perfil">
              <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="ATTENDANT">Atendente</option>
                <option value="ADMIN">Administrador</option>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving}>
                <Plus size={16} /> {saving ? 'Criando...' : 'Criar usuário'}
              </Button>
            </div>
          </form>
        </Card>

        {error && <p className="text-sm text-priority-critical mb-4">{error}</p>}

        <Card className="overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-ink-muted text-sm">Carregando...</div>
          ) : users.length === 0 ? (
            <EmptyState icon={UsersIcon} message="Nenhum usuário cadastrado." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-muted border-b border-hairline">
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Perfil</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-hairline last:border-0">
                      <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Avatar name={user.name} size={24} />
                          {user.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{user.email}</td>
                      <td className="px-4 py-3 text-ink-secondary">{ROLE_LABELS[user.role]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}
