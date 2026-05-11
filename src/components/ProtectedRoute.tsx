import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useProfile, useSession } from '@/lib/queries'

type Props = {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { user, loading } = useSession()
  const { data: profile, isLoading: profileLoading } = useProfile(user)
  const location = useLocation()
  const navigate = useNavigate()
  const [fromPath] = useState(() => location.pathname)

  const stillResolving = loading || (requireAdmin && !!user && profileLoading)
  const needsAuth = !loading && !user
  const needsAdmin =
    !stillResolving && !!user && requireAdmin && profile?.role !== 'admin'

  useEffect(() => {
    if (needsAuth) {
      navigate('/auth/login', { replace: true, state: { from: fromPath } })
    } else if (needsAdmin) {
      navigate('/', { replace: true })
    }
  }, [needsAuth, needsAdmin, fromPath, navigate])

  if (stillResolving || needsAuth || needsAdmin) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-subtle" />
      </div>
    )
  }

  return <>{children}</>
}
