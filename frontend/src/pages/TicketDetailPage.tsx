import {
  ArrowLeft,
  CheckCircle2,
  History,
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  UserCheck,
  XCircle,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { type Attachment, downloadAttachment, listAttachments, uploadAttachment } from '../api/attachments'
import { addComment, listComments } from '../api/comments'
import { type TicketHistoryEntry, listHistory } from '../api/history'
import { assignTicket, getTicket, updateTicketStatus } from '../api/tickets'
import AppShell from '../components/AppShell'
import Badge from '../components/Badge'
import SlaBadge from '../components/SlaBadge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Textarea from '../components/ui/Textarea'
import { useAuth } from '../context/AuthContext'
import type { Comment, Ticket } from '../types'
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '../types/labels'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const ticketId = Number(id)
  const { currentUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [history, setHistory] = useState<TicketHistoryEntry[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [working, setWorking] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  function reload() {
    Promise.all([getTicket(ticketId), listComments(ticketId), listAttachments(ticketId), listHistory(ticketId)])
      .then(([t, c, a, h]) => {
        setTicket(t)
        setComments(c)
        setAttachments(a)
        setHistory(h)
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

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setWorking(true)
    setActionError(null)
    try {
      await uploadAttachment(ticketId, file)
      reload()
    } catch {
      setActionError('Não foi possível enviar o anexo.')
    } finally {
      setWorking(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDownload(attachment: Attachment) {
    try {
      await downloadAttachment(attachment)
    } catch {
      setActionError('Não foi possível baixar o anexo.')
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="py-20 text-center text-ink-muted text-sm">Carregando...</div>
      </AppShell>
    )
  }

  if (error || !ticket) {
    return (
      <AppShell>
        <p className="text-priority-critical text-sm">{error ?? 'Chamado não encontrado.'}</p>
      </AppShell>
    )
  }

  const isAttendantOrAdmin = currentUser?.role === 'ATTENDANT' || currentUser?.role === 'ADMIN'
  const isRequester = currentUser?.id === ticket.requester.id
  const canAssign = isAttendantOrAdmin && ticket.status === 'NEW'
  const canResolve = isAttendantOrAdmin && ticket.status === 'IN_PROGRESS'
  const canClose = isRequester && ticket.status === 'RESOLVED'
  const canComment = ticket.status !== 'CLOSED'

  return (
    <AppShell>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink mb-3 transition-colors"
      >
        <ArrowLeft size={15} /> Voltar
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <h1 className="text-2xl font-semibold text-ink">
          <span className="text-ink-muted font-normal">#{ticket.id}</span> {ticket.title}
        </h1>
        <div className="flex items-center gap-2">
          <Badge label={PRIORITY_LABELS[ticket.priority]} color={PRIORITY_COLORS[ticket.priority]} />
          <Badge label={STATUS_LABELS[ticket.status]} color={STATUS_COLORS[ticket.status]} />
          <SlaBadge ticket={ticket} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-5">
            <p className="text-ink whitespace-pre-wrap">{ticket.description}</p>
          </Card>

          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-secondary mb-3">
              <MessageSquare size={15} /> Conversa
            </h2>

            <div className="flex flex-col gap-3">
              {comments.length === 0 && (
                <p className="text-sm text-ink-muted">Nenhum comentário ainda.</p>
              )}
              {comments.map((comment) => {
                const isRequesterComment = comment.author.id === ticket.requester.id
                return (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Avatar name={comment.author.name} size={30} />
                    <div
                      className={`flex-1 rounded-xl px-4 py-2.5 border ${
                        isRequesterComment ? 'bg-white border-hairline' : 'bg-brand-50/50 border-brand-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs text-ink-muted mb-0.5">
                        <span className="font-medium text-ink-secondary">{comment.author.name}</span>
                        <span>{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
                      </div>
                      <p className="text-sm text-ink whitespace-pre-wrap">{comment.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {canComment ? (
              <form onSubmit={handleSendComment} className="mt-4 flex flex-col gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva uma resposta..."
                  rows={3}
                />
                <Button type="submit" disabled={working || !message.trim()} size="sm" className="self-end">
                  <Send size={14} /> Enviar
                </Button>
              </form>
            ) : (
              <p className="text-sm text-ink-muted mt-4">Este chamado está fechado e não recebe mais comentários.</p>
            )}
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-secondary mb-3">
              <Paperclip size={15} /> Anexos
            </h2>
            <div className="flex flex-col gap-2">
              {attachments.length === 0 && <p className="text-sm text-ink-muted">Nenhum anexo.</p>}
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between gap-2 border border-hairline rounded-lg px-3 py-2 bg-white"
                >
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <Paperclip size={14} className="text-ink-muted shrink-0" />
                    <span className="text-ink truncate">{attachment.fileName}</span>
                    <span className="text-ink-muted text-xs shrink-0">
                      {formatSize(attachment.size)} · {attachment.uploadedBy.name}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(attachment)}>
                    Baixar
                  </Button>
                </div>
              ))}
              {canComment && (
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleUpload}
                  disabled={working}
                  className="text-sm text-ink-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-hairline file:bg-white file:text-sm file:font-medium file:text-ink-secondary hover:file:bg-page"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">Detalhes</h3>
            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-ink-muted text-xs mb-0.5">Categoria</dt>
                <dd className="text-ink font-medium">{ticket.category.name}</dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs mb-0.5">Solicitante</dt>
                <dd className="flex items-center gap-2 text-ink font-medium">
                  <Avatar name={ticket.requester.name} size={22} />
                  {ticket.requester.name}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs mb-0.5">Atendente</dt>
                <dd className="flex items-center gap-2 text-ink font-medium">
                  {ticket.attendant ? (
                    <>
                      <Avatar name={ticket.attendant.name} size={22} />
                      {ticket.attendant.name}
                    </>
                  ) : (
                    <span className="text-ink-muted font-normal">Não atribuído</span>
                  )}
                </dd>
              </div>
            </dl>

            {(canAssign || canResolve || canClose) && (
              <div className="flex flex-col gap-2 mt-5 pt-5 border-t border-hairline">
                {canAssign && (
                  <Button onClick={handleAssign} disabled={working} size="sm">
                    {working ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                    Assumir chamado
                  </Button>
                )}
                {canResolve && (
                  <Button onClick={handleResolve} disabled={working} size="sm">
                    {working ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    Marcar como resolvido
                  </Button>
                )}
                {canClose && (
                  <Button onClick={handleClose} disabled={working} size="sm" variant="secondary">
                    {working ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                    Confirmar e fechar
                  </Button>
                )}
              </div>
            )}
            {actionError && <p className="text-sm text-priority-critical mt-3">{actionError}</p>}
          </Card>

          <Card className="p-5">
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="flex items-center gap-2 text-xs font-semibold text-ink-muted uppercase tracking-wide w-full"
            >
              <History size={14} /> Histórico {history.length > 0 && `(${history.length})`}
            </button>
            {showHistory && (
              <div className="flex flex-col gap-3 mt-4">
                {history.length === 0 && <p className="text-sm text-ink-muted">Sem eventos registrados.</p>}
                {history.map((entry) => (
                  <div key={entry.id} className="text-xs border-l-2 border-hairline pl-3">
                    <div className="text-ink-muted mb-0.5">
                      {new Date(entry.createdAt).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-ink-secondary">{entry.description}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
