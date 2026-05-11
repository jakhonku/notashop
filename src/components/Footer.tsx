import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-surface-base">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-surface-base">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M9 4.5v12.25a3.25 3.25 0 1 1-2-3V4.5l11-2v9.25a3.25 3.25 0 1 1-2-3V5.18z" />
                </svg>
              </span>
              <span className="font-serif text-xl tracking-tight">NotaShop</span>
            </Link>
            <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-sm text-pretty">
              Notalar uyi — tahrirlangan, ishonchli va to'liq nota to'plami.
              Tanlang, sotib oling, ijro qiling.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-ink mb-4">Katalog</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li><Link to="/catalog?category=Klassik" className="hover:text-ink">Klassik</Link></li>
              <li><Link to="/catalog?category=Zamonaviy" className="hover:text-ink">Zamonaviy</Link></li>
              <li><Link to="/catalog?category=O'zbek" className="hover:text-ink">O'zbek</Link></li>
              <li><Link to="/catalog?category=Jazz" className="hover:text-ink">Jazz</Link></li>
              <li><Link to="/catalog?category=Pop" className="hover:text-ink">Pop</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-ink mb-4">Sayt</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li><Link to="/catalog" className="hover:text-ink">Barcha notalar</Link></li>
              <li><Link to="/cart" className="hover:text-ink">Savatcha</Link></li>
              <li><Link to="/account" className="hover:text-ink">Profil</Link></li>
              <li><Link to="/auth/register" className="hover:text-ink">Hisob ochish</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-ink mb-4">Aloqa</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li>info@notashop.uz</li>
              <li>Toshkent, O'zbekiston</li>
            </ul>
          </div>
        </div>

        <div className="ink-divider mt-16 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} NotaShop. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs italic-serif text-ink-subtle">
            "Musiqa — qalbning umumiy tili"
          </p>
        </div>
      </div>
    </footer>
  )
}
