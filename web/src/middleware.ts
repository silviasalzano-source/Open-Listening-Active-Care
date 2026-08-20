import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { getRequiredRoles, isRoleAllowed, type Role } from '@/lib/auth/routeAccess'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const requiredRoles = getRequiredRoles(request.nextUrl.pathname)

  if (!requiredRoles) {
    return response
  }

  const { url, anonKey } = getSupabaseEnv()
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = (user?.app_metadata?.role as Role | undefined) ?? null

  if (!isRoleAllowed(request.nextUrl.pathname, role)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/survey/:path*', '/admin/:path*'],
}
