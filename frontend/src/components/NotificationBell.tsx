import { Bell, Inbox } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type AppNotification, listNotifications, markAsRead, unreadCount } from '../api/notifications'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function refreshCount() {
      unreadCount().then(setCount).catch(() => {})
    }
    refreshCount()
    const interval = setInterval(refreshCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleOpen() {
    if (!open) {
      listNotifications().then(setNotifications).catch(() => {})
    }
    setOpen((o) => !o)
  }

  async function handleClick(notification: AppNotification) {
    if (!notification.read) {
      await markAsRead(notification.id).catch(() => {})
      setCount((c) => Math.max(0, c - 1))
    }
    setOpen(false)
    navigate(`/tickets/${notification.ticketId}`)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={toggleOpen}
        title="Notificações"
        className="relative w-9 h-9 flex items-center justify-center rounded-lg text-ink-secondary hover:bg-page hover:text-ink transition-colors"
      >
        <Bell size={18} />
        {count > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-priority-critical text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[110%] w-80 max-h-96 overflow-y-auto bg-white border border-hairline rounded-xl shadow-popover z-10">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-ink-muted">
              <Inbox size={28} strokeWidth={1.5} />
              <p className="text-sm">Nenhuma notificação.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={`w-full text-left px-4 py-3 border-b border-hairline last:border-0 text-sm transition-colors hover:bg-page ${
                  notification.read ? 'bg-white' : 'bg-brand-50/60'
                }`}
              >
                <div className="flex items-start gap-2">
                  {!notification.read && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />}
                  <div className={notification.read ? 'pl-3.5' : ''}>
                    <div className="text-ink">{notification.message}</div>
                    <div className="text-ink-muted text-xs mt-1">
                      {new Date(notification.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
