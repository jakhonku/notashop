import { Link } from 'react-router-dom'
import { Music } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-white/60">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-accent text-white">
              <Music className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">NotaShop</span>
          </Link>
          <p className="mt-3 text-sm text-ink-subtle leading-relaxed max-w-xs">
            Sifatli musiqa notalarini bir joyda toping. Yuklab oling va ijroni boshlang.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">Katalog</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link to="/catalog?category=Klassik" className="hover:text-ink">Klassik</Link></li>
            <li><Link to="/catalog?category=Zamonaviy" className="hover:text-ink">Zamonaviy</Link></li>
            <li><Link to="/catalog?category=O'zbek" className="hover:text-ink">O'zbek</Link></li>
            <li><Link to="/catalog?category=Jazz" className="hover:text-ink">Jazz</Link></li>
            <li><Link to="/catalog?category=Pop" className="hover:text-ink">Pop</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">Sahifalar</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link to="/catalog" className="hover:text-ink">Barcha notalar</Link></li>
            <li><Link to="/cart" className="hover:text-ink">Savatcha</Link></li>
            <li><Link to="/account" className="hover:text-ink">Profil</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">Yordam</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li>info@notashop.uz</li>
            <li>Toshkent shahri, O'zbekiston</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-subtle">© {new Date().getFullYear()} NotaShop. Barcha huquqlar himoyalangan.</p>
          <p className="text-xs text-ink-subtle">Toshkent, O'zbekiston</p>
        </div>
      </div>
    </footer>
  )
}
