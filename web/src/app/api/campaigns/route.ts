import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseRole } from '@/lib/auth/routeAccess'

async function getHrAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || parseRole(user.app_metadata?.role) !== 'hr_admin') return null
  return { supabase, user }
}

export async function GET() {
  const ctx = await getHrAdmin()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { supabase } = ctx
  const { data, error } = await supabase
    .from('survey_campaigns')
    .select('*, submissions(count)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const ctx = await getHrAdmin()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, compilation_window_start, compilation_window_end } = body

  if (!name || !compilation_window_start || !compilation_window_end) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }

  const { data, error } = await ctx.supabase
    .from('survey_campaigns')
    .insert({ name, compilation_window_start, compilation_window_end })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
