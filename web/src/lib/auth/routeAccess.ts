export type Role = 'employee' | 'hr_admin'

interface RouteRule {
  pathPrefix: string
  allowedRoles: Role[]
}

const PROTECTED_ROUTES: RouteRule[] = [
  { pathPrefix: '/survey', allowedRoles: ['employee', 'hr_admin'] },
  { pathPrefix: '/admin', allowedRoles: ['hr_admin'] },
]

export function getRequiredRoles(pathname: string): Role[] | null {
  const rule = PROTECTED_ROUTES.find((r) => pathname.startsWith(r.pathPrefix))
  return rule ? rule.allowedRoles : null
}

export function isRoleAllowed(pathname: string, role: Role | null): boolean {
  const required = getRequiredRoles(pathname)
  if (!required) return true
  if (!role) return false
  return required.includes(role)
}
