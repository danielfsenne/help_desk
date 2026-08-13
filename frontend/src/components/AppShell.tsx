import { LifeBuoy, LogOut, Menu, X } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'
import Avatar from './ui/Avatar'

function NavLink({ to, children, onClick }: { to: string; children: ReactNode; onClick?: () => void }) {
  const location = useLocation()
  const active = location.pathname === to

  return (
    <Link
      to={to}
      onClick={onClick}
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
  const [mobileOpen, setMobileOpen] = useState(false)
  if (!currentUser) return null

  const navLinks = (
    <>
      <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>
        Chamados
      </NavLink>
      {currentUser.role === 'ADMIN' && (
        <>
          <NavLink to="/categories" onClick={() => setMobileOpen(false)}>
            Categorias
          </NavLink>
          <NavLink to="/reports" onClick={() => setMobileOpen(false)}>
            Relatórios
          </NavLink>
          <NavLink to="/users" onClick={() => setMobileOpen(false)}>
            Usuários
          </NavLink>
        </>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-hairline">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-ink shrink-0">
            <LifeBuoy className="text-brand-500" size={22} strokeWidth={2.25} />
            Help Desk
          </Link>

          <nav className="hidden sm:flex items-center gap-1">{navLinks}</nav>

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NotificationBell />

            <div className="hidden sm:flex items-center gap-2">
              <Avatar name={currentUser.name} size={32} />
              <div className="hidden md:block leading-tight">
                <div className="text-sm font-medium text-ink">{currentUser.name}</div>
                <div className="text-xs text-ink-muted">{currentUser.role}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sair"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-page hover:text-ink transition-colors"
            >
              <LogOut size={18} />
            </button>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              title="Menu"
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg text-ink-secondary hover:bg-page hover:text-ink transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="sm:hidden border-t border-hairline px-4 py-3 flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-hairline">
              <Avatar name={currentUser.name} size={32} />
              <div className="leading-tight">
                <div className="text-sm font-medium text-ink">{currentUser.name}</div>
                <div className="text-xs text-ink-muted">{currentUser.role}</div>
              </div>
            </div>
            <nav className="flex flex-col gap-1">{navLinks}</nav>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-ink-secondary hover:bg-page transition-colors self-start"
            >
              <LogOut size={16} /> Sair
            </button>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  )
}
