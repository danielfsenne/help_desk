import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { listCategories } from '../api/categories'
import { createTicket } from '../api/tickets'
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
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 560, margin: '0 auto' }}>
      <Link to="/dashboard">&larr; Voltar</Link>
      <h1>Novo chamado</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Título
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          Descrição
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          Categoria
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          >
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Prioridade
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
            style={{ width: '100%', padding: 8 }}
          >
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        <button type="submit" disabled={submitting} style={{ padding: 8 }}>
          {submitting ? 'Enviando...' : 'Abrir chamado'}
        </button>
      </form>
    </div>
  )
}
