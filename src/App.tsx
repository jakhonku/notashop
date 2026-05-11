import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProtectedRoute } from '@/components/ProtectedRoute'

const Home = lazy(() => import('@/pages/Home'))
const Catalog = lazy(() => import('@/pages/Catalog'))
const NoteDetail = lazy(() => import('@/pages/NoteDetail'))
const Cart = lazy(() => import('@/pages/Cart'))
const Account = lazy(() => import('@/pages/Account'))
const Admin = lazy(() => import('@/pages/Admin'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const Success = lazy(() => import('@/pages/Success'))
const Cancel = lazy(() => import('@/pages/Cancel'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const PageFallback = () => (
  <div className="flex h-[60vh] items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-ink-subtle" />
  </div>
)

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageShell><Home /></PageShell>} />
              <Route path="/catalog" element={<PageShell><Catalog /></PageShell>} />
              <Route path="/note/:id" element={<PageShell><NoteDetail /></PageShell>} />
              <Route path="/cart" element={<PageShell><Cart /></PageShell>} />
              <Route
                path="/account"
                element={
                  <PageShell>
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  </PageShell>
                }
              />
              <Route
                path="/admin"
                element={
                  <PageShell>
                    <ProtectedRoute requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  </PageShell>
                }
              />
              <Route path="/auth/login" element={<PageShell><Login /></PageShell>} />
              <Route path="/auth/register" element={<PageShell><Register /></PageShell>} />
              <Route path="/success" element={<PageShell><Success /></PageShell>} />
              <Route path="/cancel" element={<PageShell><Cancel /></PageShell>} />
              <Route path="*" element={<PageShell><NotFound /></PageShell>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
