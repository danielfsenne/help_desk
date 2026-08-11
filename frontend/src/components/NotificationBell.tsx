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
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button onClick={toggleOpen} style={{ position: 'relative' }}>
        🔔
        {count > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: '#dc2626',
              color: '#fff',
              borderRadius: '50%',
              fontSize: 11,
              padding: '1px 5px',
              fontWeight: 700,
            }}
          >
            {count}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '110%',
            width: 320,
            maxHeight: 360,
            overflowY: 'auto',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}
        >
          {notifications.length === 0 && <p style={{ padding: 12, color: '#666' }}>Nenhuma notificação.</p>}
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleClick(notification)}
              style={{
                padding: 12,
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                background: notification.read ? '#fff' : '#eff6ff',
                fontSize: 13,
              }}
            >
              <div>{notification.message}</div>
              <div style={{ color: '#999', fontSize: 11, marginTop: 4 }}>
                {new Date(notification.createdAt).toLocaleString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
