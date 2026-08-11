import { LifeBuoy, LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  const location = useLocation()
  const active = location.pathname === to

  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active ? 'bg-brand-50 text-brand-700' : 'text-ink-secondary hover:bg-page'
      }`}
    >
      {children}
    </Link>
  )
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { currentUser, logout } = useAuth()
  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-hairline">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-ink shrink-0">
            <LifeBuoy className="text-brand-500" size={22} strokeWidth={2.25} />
            Help Desk
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard">Chamados</NavLink>
            {currentUser.role === 'ADMIN' && (
              <>
                <NavLink to="/categories">Categorias</NavLink>
                <NavLink to="/reports">Relatórios</NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <NotificationBell />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white text-xs font-semibold flex items-center justify-center">
                {initials(currentUser.name)}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-medium text-ink">{currentUser.name}</div>
                <div className="text-xs text-ink-muted">{currentUser.role}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sair"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-secondary hover:bg-page hover:text-ink transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
