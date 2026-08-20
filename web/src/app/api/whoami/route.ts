import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = (user?.app_metadata?.role as string | undefined) ?? null

  return NextResponse.json({ email: user?.email ?? null, role })
}
