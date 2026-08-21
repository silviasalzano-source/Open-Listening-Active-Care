import { afterEach, describe, expect, it, vi } from 'vitest'
import { createClient } from '../../src/lib/supabase/client'

describe('createClient (browser)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('creates a Supabase client when env vars are present', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key-123')

    const client = createClient()

    expect(client.auth).toBeDefined()
  })

  it('throws when env vars are missing', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

    expect(() => createClient()).toThrow(/Missing Supabase environment variables/)
  })
})
