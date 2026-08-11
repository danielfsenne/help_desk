import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCategories } from '../api/categories'
import { createTicket } from '../api/tickets'
import AppShell from '../components/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import PageHeader from '../components/ui/PageHeader'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import type { Category, TicketPriority } from '../types'
import { PRIORITY_LABELS } from '../types/labels'

export default function NewTicketPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM')
  const [categoryId, setCategoryId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setError('Não foi possível carregar as categorias.'))
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!categoryId) {
      setError('Selecione uma categoria')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const ticket = await createTicket({
        title,
        description,
        priority,
        categoryId: Number(categoryId),
      })
      navigate(`/tickets/${ticket.id}`)
    } catch {
      setError('Não foi possível abrir o chamado. Verifique os dados e tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-xl mx-auto">
        <PageHeader title="Novo chamado" subtitle="Descreva o problema para que um atendente possa ajudar" />

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Título">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
            </Field>

            <Field label="Descrição">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Categoria">
                <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">Selecione</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Prioridade">
                <Select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            {error && <p className="text-sm text-priority-critical">{error}</p>}

            <Button type="submit" disabled={submitting} className="self-end">
              {submitting ? 'Enviando...' : 'Abrir chamado'}
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  )
}
