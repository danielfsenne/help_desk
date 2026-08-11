import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addComment, listComments } from '../api/comments'
import { assignTicket, getTicket, updateTicketStatus } from '../api/tickets'
import Badge from '../components/Badge'
import { useAuth } from '../context/AuthContext'
import type { Comment, Ticket } from '../types'
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '../types/labels'

export default function TicketDetailPage() {
  const { id } = useParams()
  const ticketId = Number(id)
  const { currentUser } = useAuth()

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [working, setWorking] = useState(false)

  function reload() {
    Promise.all([getTicket(ticketId), listComments(ticketId)])
      .then(([t, c]) => {
        setTicket(t)
        setComments(c)
      })
      .catch(() => setError('Não foi possível carregar o chamado.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId])

  async function handleAssign() {
    setWorking(true)
    setActionError(null)
    try {
      await assignTicket(ticketId)
      reload()
    } catch {
      setActionError('Não foi possível assumir o chamado.')
    } finally {
      setWorking(false)
    }
  }

  async function handleResolve() {
    setWorking(true)
    setActionError(null)
    try {
      await updateTicketStatus(ticketId, 'RESOLVED')
      reload()
    } catch {
      setActionError('Não foi possível resolver o chamado.')
    } finally {
      setWorking(false)
    }
  }

  async function handleClose() {
    setWorking(true)
    setActionError(null)
    try {
      await updateTicketStatus(ticketId, 'CLOSED')
      reload()
    } catch {
      setActionError('Não foi possível fechar o chamado.')
    } finally {
      setWorking(false)
    }
  }

  async function handleSendComment(event: React.FormEvent) {
    event.preventDefault()
    if (!message.trim()) return

    setWorking(true)
    setActionError(null)
    try {
      await addComment(ticketId, message.trim())
      setMessage('')
      reload()
    } catch {
      setActionError('Não foi possível enviar a resposta.')
    } finally {
      setWorking(false)
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Carregando...</p>
  if (error || !ticket) return <p style={{ padding: 24, color: 'crimson' }}>{error ?? 'Chamado não encontrado.'}</p>

  const isAttendantOrAdmin = currentUser?.role === 'ATTENDANT' || currentUser?.role === 'ADMIN'
  const isRequester = currentUser?.id === ticket.requester.id
  const canAssign = isAttendantOrAdmin && ticket.status === 'NEW'
  const canResolve = isAttendantOrAdmin && ticket.status === 'IN_PROGRESS'
  const canClose = isRequester && ticket.status === 'RESOLVED'
  const canComment = ticket.status !== 'CLOSED'

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <Link to="/dashboard">&larr; Voltar</Link>

      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, margin: '16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>
            #{ticket.id} — {ticket.title}
          </h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge label={PRIORITY_LABELS[ticket.priority]} color={PRIORITY_COLORS[ticket.priority]} />
            <Badge label={STATUS_LABELS[ticket.status]} color={STATUS_COLORS[ticket.status]} />
          </div>
        </div>

        <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
          Categoria: {ticket.category.name} · Solicitante: {ticket.requester.name} · Atendente:{' '}
          {ticket.attendant?.name ?? 'não atribuído'}
        </p>

        <p style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {canAssign && (
            <button onClick={handleAssign} disabled={working}>
              Assumir chamado
            </button>
          )}
          {canResolve && (
            <button onClick={handleResolve} disabled={working}>
              Marcar como resolvido
            </button>
          )}
          {canClose && (
            <button onClick={handleClose} disabled={working}>
              Confirmar e fechar
            </button>
          )}
        </div>
        {actionError && <p style={{ color: 'crimson' }}>{actionError}</p>}
      </div>

      <h2 style={{ fontSize: 16 }}>Conversa</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {comments.length === 0 && <p style={{ color: '#666' }}>Nenhum comentário ainda.</p>}
        {comments.map((comment) => (
          <div key={comment.id} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12 }}>
            <strong>{comment.author.name}</strong>
            <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{comment.message}</p>
          </div>
        ))}
      </div>

      {canComment ? (
        <form onSubmit={handleSendComment} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva uma resposta..."
            rows={3}
            style={{ width: '100%', padding: 8 }}
          />
          <button type="submit" disabled={working || !message.trim()} style={{ alignSelf: 'flex-end', padding: 8 }}>
            Enviar
          </button>
        </form>
      ) : (
        <p style={{ color: '#666' }}>Este chamado está fechado e não recebe mais comentários.</p>
      )}
    </div>
  )
}
