'use client'

import { useState, type FormEvent } from 'react'

export function NameModal({ onConfirm }: { onConfirm: (nome: string, cognome: string) => void }) {
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
              <p>Le risposte di "My Energy Battery" sono associate al tuo nome, per permetterci di preparare il tuo momento di ascolto personalizzato.</p>
            </div>
          </div>
          <div className="name-modal-phase">
            <span className="name-modal-phase-icon">🔒</span>
            <div>
              <strong>Seconda parte — anonima</strong>
              <p>I "Fattori Energy Battery" sono completamente anonimi: nessuno saprà mai chi ha risposto cosa.</p>
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
              onChange={e => setNome(e.target.value)}
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
              onChange={e => setCognome(e.target.value)}
              required
            />
          </div>
          <button className="btn name-modal-submit" type="submit" disabled={!valid}>
            Ho capito, inizio →
          </button>
        </form>
      </div>
    </div>
  )
}
