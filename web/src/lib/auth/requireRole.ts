import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { parseRole, type Role } from './routeAccess'

export async function requireRole(allowedRoles: Role[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = parseRole(user.app_metadata?.role)

  if (!role) {
    redirect('/login')
  }

  if (!allowedRoles.includes(role)) {
    redirect('/survey')
  }

  return { user, role }
}
