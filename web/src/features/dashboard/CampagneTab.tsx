'use client'
import { useEffect, useState, useCallback } from 'react'

type Campaign = {
  id: string
  name: string
  compilation_window_start: string
  compilation_window_end: string
  edit_window_start: string | null
  edit_window_end: string | null
  created_at: string
  submissions?: { count: number }[]
}

function campaignStatus(c: Campaign): 'upcoming' | 'open' | 'closed' {
  const now = Date.now()
  const start = new Date(c.compilation_window_start).getTime()
  const end = new Date(c.compilation_window_end).getTime()
  if (now < start) return 'upcoming'
  if (now <= end) return 'open'
  return 'closed'
}

function editWindowStatus(c: Campaign): 'none' | 'open' | 'closed' {
  if (!c.edit_window_start || !c.edit_window_end) return 'none'
  const now = Date.now()
  const start = new Date(c.edit_window_start).getTime()
  const end = new Date(c.edit_window_end).getTime()
  if (now < start) return 'closed'
  if (now <= end) return 'open'
  return 'closed'
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
}

function respondentCount(c: Campaign) {
  return c.submissions?.[0]?.count ?? 0
}

/* ---- Create form ---- */
function CreateForm({ onCreated, onCancel }: { onCreated: (c: Campaign) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !start || !end) { setErr('Tutti i campi sono obbligatori.'); return }
    if (new Date(end) <= new Date(start)) { setErr('La data di chiusura deve essere successiva all\'apertura.'); return }
    setSaving(true); setErr(null)
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, compilation_window_start: start, compilation_window_end: end }),
      })
      const json = await res.json()
      if (!res.ok) { setErr(json.error ?? 'Errore imprevisto'); return }
      onCreated(json)
    } catch { setErr('Errore di rete') } finally { setSaving(false) }
  }

  return (
    <form className="cmp-create-form" onSubmit={submit}>
      <div className="cmp-form-title">Nuova campagna</div>
      <label className="cmp-field">
        <span>Nome campagna</span>
        <input className="cmp-input" value={name} onChange={e => setName(e.target.value)} placeholder="es. Open Listening 2026" />
      </label>
      <div className="cmp-field-row">
        <label className="cmp-field">
          <span>Apertura compilazione</span>
          <input className="cmp-input" type="date" value={start} onChange={e => setStart(e.target.value)} />
        </label>
        <label className="cmp-field">
          <span>Chiusura compilazione</span>
          <input className="cmp-input" type="date" value={end} onChange={e => setEnd(e.target.value)} />
        </label>
      </div>
      {err && <div className="cmp-err">{err}</div>}
      <div className="cmp-form-actions">
        <button type="button" className="cmp-btn ghost" onClick={onCancel} disabled={saving}>Annulla</button>
        <button type="submit" className="cmp-btn primary" disabled={saving}>{saving ? 'Salvataggio…' : 'Crea campagna'}</button>
      </div>
    </form>
  )
}

/* ---- Edit window panel ---- */
function EditWindowPanel({ campaign, onUpdated }: { campaign: Campaign; onUpdated: (c: Campaign) => void }) {
  const [ewStart, setEwStart] = useState(campaign.edit_window_start?.slice(0, 10) ?? '')
  const [ewEnd, setEwEnd] = useState(campaign.edit_window_end?.slice(0, 10) ?? '')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const status = editWindowStatus(campaign)

  async function save() {
    if (ewStart && ewEnd && new Date(ewEnd) <= new Date(ewStart)) {
      setErr('La data di chiusura deve essere successiva all\'apertura.'); return
    }
    setSaving(true); setErr(null)
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          edit_window_start: ewStart ? new Date(ewStart).toISOString() : null,
          edit_window_end: ewEnd ? new Date(ewEnd).toISOString() : null,
        }),
      })
      const json = await res.json()
      if (!res.ok) { setErr(json.error ?? 'Errore'); return }
      onUpdated(json)
    } catch { setErr('Errore di rete') } finally { setSaving(false) }
  }

  async function clear() {
    setSaving(true); setErr(null)
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edit_window_start: null, edit_window_end: null }),
      })
      const json = await res.json()
      if (!res.ok) { setErr(json.error ?? 'Errore'); return }
      setEwStart(''); setEwEnd('')
      onUpdated(json)
    } catch { setErr('Errore di rete') } finally { setSaving(false) }
  }

  return (
    <div className="cmp-ew-panel">
      <div className="cmp-ew-label">
        Finestra di modifica
        {status === 'open' && <span className="cmp-badge open">Aperta</span>}
        {status === 'closed' && <span className="cmp-badge closed">Chiusa</span>}
        {status === 'none' && <span className="cmp-badge none">Non configurata</span>}
      </div>
      <div className="cmp-ew-dates">
        <label className="cmp-field-sm">
          <span>Dal</span>
          <input className="cmp-input sm" type="date" value={ewStart} onChange={e => setEwStart(e.target.value)} />
        </label>
        <label className="cmp-field-sm">
          <span>Al</span>
          <input className="cmp-input sm" type="date" value={ewEnd} onChange={e => setEwEnd(e.target.value)} />
        </label>
        <button className="cmp-btn sm primary" onClick={save} disabled={saving}>Salva</button>
        {(ewStart || ewEnd) && <button className="cmp-btn sm ghost" onClick={clear} disabled={saving}>Rimuovi</button>}
      </div>
      {err && <div className="cmp-err sm">{err}</div>}
    </div>
  )
}

/* ---- Campaign card ---- */
function CampaignCard({ campaign, onUpdated }: { campaign: Campaign; onUpdated: (c: Campaign) => void }) {
  const [expanded, setExpanded] = useState(false)
  const status = campaignStatus(campaign)
  const count = respondentCount(campaign)

  return (
    <div className={`cmp-card ${status}`}>
      <div className="cmp-card-top" onClick={() => setExpanded(v => !v)}>
        <div className="cmp-card-left">
          <span className={`cmp-status-badge ${status}`}>
            {status === 'open' ? 'Aperta' : status === 'upcoming' ? 'Programmata' : 'Chiusa'}
          </span>
          <span className="cmp-card-name">{campaign.name}</span>
        </div>
        <div className="cmp-card-right">
          <span className="cmp-card-meta">
            {fmtDate(campaign.compilation_window_start)} → {fmtDate(campaign.compilation_window_end)}
          </span>
          <span className="cmp-card-count">{count} <span>rispondenti</span></span>
          <svg className={`cmp-chevron ${expanded ? 'up' : ''}`} viewBox="0 0 20 20" width="14" height="14" fill="none">
            <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {expanded && (
        <div className="cmp-card-body">
          <EditWindowPanel campaign={campaign} onUpdated={onUpdated} />
        </div>
      )}
    </div>
  )
}

/* ---- Main tab ---- */
export function CampagneTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setErr(null)
    try {
      const res = await fetch('/api/campaigns')
      const json = await res.json()
      if (!res.ok) { setErr(json.error ?? 'Errore'); return }
      setCampaigns(json)
    } catch { setErr('Errore di rete') } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function handleCreated(c: Campaign) { setCampaigns(prev => [c, ...prev]); setCreating(false) }
  function handleUpdated(c: Campaign) { setCampaigns(prev => prev.map(x => x.id === c.id ? c : x)) }

  return (
    <div className="cmp-tab">
      <div className="cmp-header">
        <div>
          <div className="cmp-title">Campagne</div>
          <div className="cmp-subtitle">Crea e gestisci le edizioni del survey</div>
        </div>
        {!creating && (
          <button className="cmp-btn primary" onClick={() => setCreating(true)}>
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Nuova campagna
          </button>
        )}
      </div>

      {creating && <CreateForm onCreated={handleCreated} onCancel={() => setCreating(false)} />}

      {loading && <div className="cmp-loading">Caricamento campagne…</div>}
      {err && <div className="cmp-err page">{err}</div>}

      {!loading && !err && campaigns.length === 0 && !creating && (
        <div className="cmp-empty">
          <div className="cmp-empty-icon">📋</div>
          <div>Nessuna campagna ancora creata.</div>
          <div className="cmp-empty-sub">Crea la prima campagna per iniziare a raccogliere risposte.</div>
        </div>
      )}

      <div className="cmp-list">
        {campaigns.map(c => (
          <CampaignCard key={c.id} campaign={c} onUpdated={handleUpdated} />
        ))}
      </div>
    </div>
  )
}
