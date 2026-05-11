import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User as UserIcon, LogOut, Shield } from 'lucide-react'
import { useCart } from '@/store/cartStore'
import { useProfile, useSession } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const links = [
  { to: '/', label: 'Bosh' },
  { to: '/catalog', label: 'Katalog' },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-surface-base">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M9 4.5v12.25a3.25 3.25 0 1 1-2-3V4.5l11-2v9.25a3.25 3.25 0 1 1-2-3V5.18z" />
        </svg>
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-gold" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl tracking-tight text-ink">NotaShop</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-subtle mt-0.5">
          Notalar uyi
        </span>
      </span>
    </Link>
  )
}

export function Navbar() {
  const items = useCart((s) => s.items)
  const { user } = useSession()
  const { data: profile } = useProfile(user)
  const navigate = useNavigate()

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-ink/10">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-sm transition-colors',
                  isActive
                    ? 'text-ink font-medium'
                    : 'text-ink-muted hover:text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 transition-colors"
            aria-label="Savatcha"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {items.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-semibold text-ink tabular-nums shadow-soft ring-2 ring-surface-base">
                {items.length}
              </span>
            )}
          </Link>

          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 transition-colors"
              aria-label="Boshqaruv"
            >
              <Shield className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-1">
              <Link
                to="/account"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 transition-colors"
                aria-label="Profil"
              >
                <UserIcon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </Link>
              <button
                onClick={signOut}
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 transition-colors"
                aria-label="Chiqish"
              >
                <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-1">
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth/login">Kirish</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth/register">Hisob ochish</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
