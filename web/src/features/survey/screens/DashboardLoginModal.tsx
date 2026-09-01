'use client'

import { useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  onClose: () => void
}

export function DashboardLoginModal({ onClose }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError || !data.user) {
        setError('Email o password non corrette.')
        setLoading(false)
        return
      }

      const role = data.user.app_metadata?.role
      if (role !== 'hr_admin' && role !== 'bu_manager') {
        await supabase.auth.signOut()
        setError('Accesso non autorizzato. Solo HR e Manager di BU possono accedere alla dashboard.')
        setLoading(false)
        return
      }

      window.location.href = '/admin'
    } catch {
      setError('Errore di rete. Riprova più tardi.')
      setLoading(false)
    }
  }

  return (
    <div className="db-login-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="db-login-card">
        <div className="db-login-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="18" width="5" height="10" rx="2" fill="#FFB648"/>
            <rect x="10" y="12" width="5" height="16" rx="2" fill="#FF6E86"/>
            <rect x="17" y="7" width="5" height="21" rx="2" fill="#17B8A6"/>
            <rect x="24" y="14" width="5" height="14" rx="2" fill="#2E86DE"/>
          </svg>
          <div>
            <div className="db-login-title-brand"><strong>OPEN LISTENING</strong> · ACTIVE CARE</div>
            <div className="db-login-subtitle-brand">OT Consulting</div>
          </div>
        </div>

        <h2 className="db-login-title">OT Energy</h2>

        <form onSubmit={handleSubmit} className="db-login-form">
          <div className="db-login-field">
            <label className="db-login-label">UTENTE</label>
            <input
              className="db-login-input"
              type="email"
              placeholder="es. hr@otconsulting.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="db-login-field">
            <label className="db-login-label">PASSWORD</label>
            <input
              className="db-login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="db-login-error">{error}</div>}

          <button className="db-login-submit" type="submit" disabled={loading}>
            {loading ? 'Accesso in corso…' : 'Accedi alla dashboard'}
          </button>
          <button className="db-login-cancel" type="button" onClick={onClose}>Annulla</button>
        </form>
      </div>
    </div>
  )
}
