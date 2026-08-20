import { describe, expect, it } from 'vitest'
import { getRequiredRoles, isRoleAllowed } from '../../src/lib/auth/routeAccess'

describe('getRequiredRoles', () => {
  it('returns both roles for /survey routes', () => {
    expect(getRequiredRoles('/survey')).toEqual(['employee', 'hr_admin'])
    expect(getRequiredRoles('/survey/step-1')).toEqual(['employee', 'hr_admin'])
  })

  it('returns only hr_admin for /admin routes', () => {
    expect(getRequiredRoles('/admin')).toEqual(['hr_admin'])
    expect(getRequiredRoles('/admin/reports')).toEqual(['hr_admin'])
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
})
