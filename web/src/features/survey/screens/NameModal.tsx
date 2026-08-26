// web/src/features/survey/screens/NameModal.tsx
'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { createPortal } from 'react-dom'

function NameModalContent({
  onConfirm,
  saving,
  error,
}: {
  onConfirm: (nome: string, cognome: string) => void
  saving: boolean
  error: string | null
}) {
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (nome.trim() && cognome.trim()) {
      onConfirm(nome.trim(), cognome.trim())
    }
  }

  const valid = nome.trim().length > 0 && cognome.trim().length > 0

  return (
    <div className="name-modal-overlay">
      <div className="name-modal-card">
        <span className="name-modal-badge">Nominativo</span>
        <h2 className="name-modal-title">Prima di iniziare</h2>

        <div className="name-modal-phases">
          <div className="name-modal-phase">
            <span className="name-modal-phase-icon">🔓</span>
            <div>
              <strong>Prima parte — nominativa</strong>
              <p>
                Le risposte di &quot;My Energy Battery&quot; sono{' '}
                <strong>associate al tuo nome</strong>, per permetterci di preparare il tuo{' '}
                <strong>momento di ascolto personalizzato</strong>.
              </p>
            </div>
          </div>
          <div className="name-modal-phase">
            <span className="name-modal-phase-icon">🔒</span>
            <div>
              <strong>Seconda parte — anonima</strong>
              <p>
                I &quot;Fattori Energy Battery&quot; sono <strong>completamente anonimi</strong>:{' '}
                <strong>nessuno saprà mai</strong> chi ha risposto cosa.
              </p>
            </div>
          </div>
        </div>

        <form className="name-modal-form" onSubmit={handleSubmit}>
          <div className="name-modal-field">
            <label className="name-modal-label">Nome</label>
            <input
              className="name-modal-input"
              type="text"
              placeholder="Il tuo nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="name-modal-field">
            <label className="name-modal-label">Cognome</label>
            <input
              className="name-modal-input"
              type="text"
              placeholder="Il tuo cognome"
              value={cognome}
              onChange={(e) => setCognome(e.target.value)}
              required
            />
          </div>
          {error && <div className="name-modal-error">{error}</div>}
          <button className="btn name-modal-submit" type="submit" disabled={!valid || saving}>
            {saving ? 'Salvataggio…' : 'Ho capito, inizio →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export function NameModal({
  onConfirm,
  saving,
  error,
}: {
  onConfirm: (nome: string, cognome: string) => void
  saving: boolean
  error: string | null
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null
  return createPortal(
    <NameModalContent onConfirm={onConfirm} saving={saving} error={error} />,
    document.body
  )
}
