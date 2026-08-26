import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  getRequiredRoles,
  isRoleAllowed,
  parseRole,
  PROTECTED_MATCHERS,
} from '../../src/lib/auth/routeAccess'

describe('getRequiredRoles', () => {
  it('returns both roles for /survey routes', () => {
    expect(getRequiredRoles('/survey')).toEqual(['employee', 'hr_admin'])
    expect(getRequiredRoles('/survey/step-1')).toEqual(['employee', 'hr_admin'])
  })

  it('returns hr_admin and bu_manager for /admin routes', () => {
    expect(getRequiredRoles('/admin')).toEqual(['hr_admin', 'bu_manager'])
    expect(getRequiredRoles('/admin/reports')).toEqual(['hr_admin', 'bu_manager'])
  })

  it('returns null for unprotected routes', () => {
    expect(getRequiredRoles('/login')).toBeNull()
    expect(getRequiredRoles('/')).toBeNull()
  })
})

describe('isRoleAllowed', () => {
  it('allows unprotected routes regardless of role', () => {
    expect(isRoleAllowed('/login', null)).toBe(true)
    expect(isRoleAllowed('/login', 'employee')).toBe(true)
  })

  it('denies /admin to an employee', () => {
    expect(isRoleAllowed('/admin', 'employee')).toBe(false)
  })

  it('allows /admin to hr_admin', () => {
    expect(isRoleAllowed('/admin', 'hr_admin')).toBe(true)
  })

  it('denies protected routes when there is no role (unauthenticated)', () => {
    expect(isRoleAllowed('/survey', null)).toBe(false)
    expect(isRoleAllowed('/admin', null)).toBe(false)
  })

  // NOTE (regression for the redirect-loop bug): isRoleAllowed(path, null) is
  // correctly `false` for protected routes, but that is NOT enough on its own
  // for a caller to decide where to send the user. A role of `null` means
  // "no role at all" (unprovisioned/legacy user) and must be routed to
  // /login — never redirected back into a path that itself requires a role,
  // or the redirect loops forever. Only once role is known non-null should a
  // caller use isRoleAllowed to decide between "allowed" and "/survey"
  // (wrong role, but still a valid session). This contract is enforced by
  // middleware.ts and requireRole.ts, which is why the check there must be
  // `if (!role) redirect/return NextResponse.redirect('/login')` BEFORE
  // calling isRoleAllowed at all — not something these pure functions can
  // guard against by themselves.
})

describe('middleware/PROTECTED_MATCHERS sync', () => {
  it('middleware.ts matcher stays in sync with PROTECTED_MATCHERS', () => {
    const middlewarePath = fileURLToPath(new URL('../../src/middleware.ts', import.meta.url))
    const middlewareSource = readFileSync(middlewarePath, 'utf-8')

    for (const matcher of PROTECTED_MATCHERS) {
      expect(middlewareSource).toContain(`'${matcher}'`)
    }
  })
})

describe('parseRole', () => {
  it("returns 'employee' for 'employee'", () => {
    expect(parseRole('employee')).toBe('employee')
  })

  it("returns 'hr_admin' for 'hr_admin'", () => {
    expect(parseRole('hr_admin')).toBe('hr_admin')
  })

  it('returns null for an unrecognized string', () => {
    expect(parseRole('manager')).toBeNull()
  })

  it('returns null for undefined', () => {
    expect(parseRole(undefined)).toBeNull()
  })

  it('returns null for null', () => {
    expect(parseRole(null)).toBeNull()
  })
})
