import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Note, Profile, Purchase } from '@/types'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return
      setSession(s)
      setLoading(false)
    })

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession((prev) => prev ?? data.session)
      setLoading(false)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return { session, user: session?.user ?? null, loading }
}

export function useProfile(user: User | null) {
  return useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      if (error) throw error
      return data as Profile | null
    },
  })
}

export function useNotes() {
  return useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Note[]
    },
  })
}

export function useNote(id: string | undefined) {
  return useQuery<Note | null>({
    queryKey: ['note', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      return data as Note | null
    },
  })
}

export function useMyPurchases(userId: string | undefined) {
  return useQuery<Purchase[]>({
    queryKey: ['purchases', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('purchases')
        .select('*, note:notes(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Purchase[]
    },
  })
}
