import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Music, ShoppingBag, User as UserIcon, LogOut, Shield } from 'lucide-react'
import { useCart } from '@/store/cartStore'
import { useProfile, useSession } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const links = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/catalog', label: 'Katalog' },
]

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
    <header className="sticky top-0 z-40 w-full glass border-b border-black/5">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-accent text-white shadow-[0_4px_12px_rgba(0,113,227,0.3)] transition-transform group-hover:scale-105">
            <Music className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">NotaShop</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-ink bg-black/5' : 'text-ink-muted hover:text-ink hover:bg-black/5',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            to="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/5 transition-colors"
            aria-label="Savatcha"
          >
            <ShoppingBag className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-white tabular-nums shadow-md ring-2 ring-white">
                {items.length}
              </span>
            )}
          </Link>

          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/5 transition-colors"
              aria-label="Admin paneli"
            >
              <Shield className="h-5 w-5" />
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/account"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/5 transition-colors"
                aria-label="Profil"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
              <button
                onClick={signOut}
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/5 transition-colors"
                aria-label="Chiqish"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-1">
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth/login">Kirish</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth/register">Ro'yxatdan o'tish</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
