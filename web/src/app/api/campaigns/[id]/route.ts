import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseRole } from '@/lib/auth/routeAccess'

async function getHrAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || parseRole(user.app_metadata?.role) !== 'hr_admin') return null
  return { supabase }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getHrAdmin()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const allowed = ['name', 'compilation_window_start', 'compilation_window_end', 'edit_window_start', 'edit_window_end']
  const patch = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 })
  }

  const { data, error } = await ctx.supabase
    .from('survey_campaigns')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
