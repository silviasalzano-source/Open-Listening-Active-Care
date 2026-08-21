import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseRole } from '@/lib/auth/routeAccess'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = parseRole(user?.app_metadata?.role)

  return NextResponse.json({ email: user?.email ?? null, role })
}
