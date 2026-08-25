export type Role = 'employee' | 'hr_admin' | 'bu_manager'

export interface RouteRule {
  pathPrefix: string
  allowedRoles: Role[]
}

export const PROTECTED_ROUTES: RouteRule[] = [
  { pathPrefix: '/survey', allowedRoles: ['employee', 'hr_admin'] },
  { pathPrefix: '/admin', allowedRoles: ['hr_admin', 'bu_manager'] },
]

export const PROTECTED_MATCHERS = PROTECTED_ROUTES.map((rule) => `${rule.pathPrefix}/:path*`)

const KNOWN_ROLES: Role[] = ['employee', 'hr_admin', 'bu_manager']

export function parseRole(value: unknown): Role | null {
  return typeof value === 'string' && (KNOWN_ROLES as string[]).includes(value)
    ? (value as Role)
    : null
}

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
