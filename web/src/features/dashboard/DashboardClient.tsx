'use client'

import { useEffect, useState } from 'react'
import './dashboard.css'

/* ---- Types ---- */
interface SurveyResponse {
  nome?: string
  cognome?: string
  clima?: string
  termometro?: number
  causa?: string[]
  descrizione?: string
  bu?: string
  anzianita?: string
  ruolo?: string
  relazioni_q?: number
  referente_crescita?: number
  referente_obiettivi?: number
  hr_access?: number
  hr_valore?: number
  mgmt_trasp?: number
  mgmt_fiducia?: number
  jc_task?: number
  jc_schemi?: number
  sv_crescita?: number
  sv_investimento?: number
  engagement?: number
  tecnologia?: number
  stress_carico?: number
  stress_recupero?: number
  open_listening?: number
  priorita?: string[]
  soddisfazione?: number
  nps?: number
}

const LS_KEY = 'ol_responses'
const LS_SEED_KEY = 'ol_seeded'
const PRIVACY_MIN = 5

/* ---- Deterministic mock data (LCG) ---- */
function mkRng(seed: number) {
  let s = seed >>> 0
  return {
    next(min: number, max: number) {
      s = (Math.imul(s, 1664525) + 1013904223) | 0
      return min + ((s >>> 0) % (max - min + 1))
    },
    pick<T>(arr: T[]): T {
      s = (Math.imul(s, 1664525) + 1013904223) | 0
      return arr[(s >>> 0) % arr.length]
    },
    pickN<T>(arr: T[], n: number): T[] {
      const avail = [...arr]
      const r: T[] = []
      for (let i = 0; i < Math.min(n, avail.length); i++) {
        s = (Math.imul(s, 1664525) + 1013904223) | 0
        const ix = (s >>> 0) % avail.length
        r.push(avail.splice(ix, 1)[0])
      }
      return r
    },
  }
}

function generateMockData(): SurveyResponse[] {
  const rng = mkRng(0xdeadbeef)
  const bus = ['Operation & Delivery', 'Sales & Marketing', 'IT (interno, helpdesk)', 'HR', 'Amministrazione', 'Servizi Generali']
  const anzs = ['< 1 anno', '1-2 anni', '3-4 anni', '5-6 anni', '7-8-9 anni', '>= 10 anni']
  const ruoli = ['Manager', 'Worker']
  const climas = ['Soleggiato', 'Parzialmente nuvoloso', 'Piovoso', 'Temporalesco']
  const descrs = ['Crescita', 'Stabile', 'Ricarica', 'Assestamento']
  const causeOpts = ['Carico di lavoro', 'Relazioni con colleghi', 'Rapporto con il/la responsabile', 'Crescita e sviluppo professionale', 'Strumenti e organizzazione', 'Motivi personali/extra-lavorativi']
  const prioOpts = ['Maggiore chiarezza sugli obiettivi', 'Più supporto dal/dalla responsabile', 'Migliori strumenti di lavoro', 'Più opportunità di crescita', 'Migliorare il clima del team', 'Più equilibrio vita-lavoro']
  const nomi = ['Marco', 'Sara', 'Luca', 'Anna', 'Giuseppe', 'Maria', 'Antonio', 'Francesca', 'Davide', 'Elena', 'Matteo', 'Giulia']
  const cognomi = ['Rossi', 'Bianchi', 'Ferrari', 'Esposito', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno']
  const res: SurveyResponse[] = []
  for (let i = 0; i < 60; i++) {
    const seed2 = i * 137 + 42
    const r2 = mkRng(seed2)
    const termo = rng.next(1, 10)
    res.push({
      nome: r2.pick(nomi), cognome: r2.pick(cognomi),
      clima: rng.pick(climas), termometro: termo,
      causa: rng.pickN(causeOpts, rng.next(1, 2)), descrizione: rng.pick(descrs),
      bu: rng.pick(bus), anzianita: rng.pick(anzs), ruolo: rng.pick(ruoli),
      relazioni_q: rng.next(1, 5), referente_crescita: rng.next(1, 5),
      referente_obiettivi: rng.next(1, 5), hr_access: rng.next(1, 5),
      hr_valore: rng.next(1, 5), mgmt_trasp: rng.next(1, 5),
      mgmt_fiducia: rng.next(1, 5), jc_task: rng.next(1, 5),
      jc_schemi: rng.next(1, 5), sv_crescita: rng.next(1, 5),
      sv_investimento: rng.next(1, 5), engagement: rng.next(1, 5),
      tecnologia: rng.next(1, 5), stress_carico: rng.next(1, 5),
      stress_recupero: rng.next(1, 5),
      open_listening: rng.next(0, 1) > 0 ? rng.next(1, 5) : undefined,
      priorita: rng.pickN(prioOpts, rng.next(1, 3)),
      soddisfazione: rng.next(1, 5), nps: rng.next(0, 10),
    })
  }
  return res
}

/* ---- Chart helpers ---- */
function avg(arr: (number | null | undefined)[]): number {
  const v = arr.filter((x): x is number => x != null)
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0
}
function scoreClass(v: number) { return v < 2.6 ? 'red' : v < 3.6 ? 'amber' : 'green' }
function buildDistrib(vals: (number | null | undefined)[]) {
  const d: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  vals.filter((v): v is number => v != null).forEach(v => { if (v >= 1 && v <= 5) d[v]++ })
  return d
}

/* ---- Sub-components ---- */
function Strip({ distrib, total }: { distrib: Record<number, number>; total: number }) {
  const colors = ['#FF6E86', '#FFAD70', '#FFB648', '#6ECFC9', '#17B8A6']
  if (total === 0) return <div className="db-strip empty" />
  return (
    <div className="db-strip">
      {[1, 2, 3, 4, 5].map((k, i) => {
        const pct = total ? (distrib[k] / total) * 100 : 0
        return pct > 0 ? (
          <div key={k} className="db-strip-seg" style={{ width: `${pct}%`, background: colors[i] }} title={`${k}: ${distrib[k]}`} />
        ) : null
      })}
    </div>
  )
}

function LikertCard({ title, eyebrow, items, data }: {
  title: string; eyebrow: string
  items: { label: string; short?: string; key: keyof SurveyResponse }[]
  data: SurveyResponse[]
}) {
  return (
    <div className="db-card">
      <div className="db-card-eyebrow">{eyebrow}</div>
      <div className="db-card-title">{title}</div>
      <div className="db-item-list">
        {items.map(it => {
          const vals = data.map(r => r[it.key] as number | null)
          const mean = avg(vals)
          const distrib = buildDistrib(vals)
          const n = vals.filter(v => v != null).length
          return (
            <div key={it.key as string} className="db-item">
              <div className="db-item-label">{it.short ?? it.label}</div>
              <Strip distrib={distrib} total={n} />
              <span className={`db-score-num ${scoreClass(mean)}`}>{mean.toFixed(1)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DistBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div className="db-dist-row">
      <span className="db-dist-label">{label}</span>
      <div className="db-dist-track">
        <div className="db-dist-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="db-dist-pct">{pct}%</span>
    </div>
  )
}

/* ---- Main component ---- */
export function DashboardClient({ userEmail, userRole }: { userEmail: string; userRole: 'hr_admin' | 'bu_manager' }) {
  const isHR = userRole === 'hr_admin'
  const [tab, setTab] = useState<'q1' | 'q2'>(isHR ? 'q1' : 'q2')
  const [buF, setBuF] = useState('')
  const [anzF, setAnzF] = useState('')
  const [ruoloF, setRuoloF] = useState('')
  const [all, setAll] = useState<SurveyResponse[]>([])
  const [q1Search, setQ1Search] = useState('')
  const [q1BuFilter, setQ1BuFilter] = useState('')
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(LS_SEED_KEY)) {
      localStorage.setItem(LS_KEY, JSON.stringify(generateMockData()))
      localStorage.setItem(LS_SEED_KEY, '1')
    }
    try {
      setAll(JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'))
    } catch { setAll([]) }
  }, [])

  const filtered = all.filter(r =>
    (!buF || buF === 'Tutte le aree' || r.bu === buF) &&
    (!anzF || anzF === 'Tutte le anzianità' || r.anzianita === anzF) &&
    (!ruoloF || ruoloF === 'Tutti i ruoli' || r.ruolo === ruoloF)
  )
  const N = filtered.length
  const privacyBlock = tab === 'q2' && N < PRIVACY_MIN

  const termVals = all.map(r => r.termometro).filter((v): v is number => v != null)
  const termAvg = avg(termVals)

  const climaOpts = [
    { label: 'Soleggiato', icon: '☀️', col: '#F5C842' },
    { label: 'Parzialmente nuvoloso', icon: '⛅', col: '#90B8D4' },
    { label: 'Piovoso', icon: '🌧️', col: '#4A9ED4' },
    { label: 'Temporalesco', icon: '⛈️', col: '#6E4CAB' },
  ]
  const climaCount: Record<string, number> = {}
  all.forEach(r => { if (r.clima) climaCount[r.clima] = (climaCount[r.clima] ?? 0) + 1 })

  const causeCount: Record<string, number> = {}
  all.forEach(r => r.causa?.forEach(c => { causeCount[c] = (causeCount[c] ?? 0) + 1 }))
  const causeTop = Object.entries(causeCount).sort((a, b) => b[1] - a[1])

  const descOpts = [
    { label: 'Energia in Crescita', icon: '⚡', col: '#17B8A6' },
    { label: 'Energia Stabile', icon: '🔋', col: '#2E86DE' },
    { label: 'Energia in Ricarica', icon: '🔌', col: '#FFB648' },
    { label: 'Energia in Assestamento', icon: '🌱', col: '#9A93A8' },
  ]
  const descrCount: Record<string, number> = {}
  all.forEach(r => { if (r.descrizione) descrCount[r.descrizione] = (descrCount[r.descrizione] ?? 0) + 1 })

  /* NPS */
  const npsVals = filtered.map(r => r.nps).filter((v): v is number => v != null)
  const det = npsVals.filter(v => v <= 6).length
  const pas = npsVals.filter(v => v >= 7 && v <= 8).length
  const pro = npsVals.filter(v => v >= 9).length
  const npsScore = npsVals.length ? Math.round(((pro - det) / npsVals.length) * 100) : null
  const npsColorClass = npsScore == null ? '' : npsScore >= 30 ? 'green' : npsScore >= 0 ? 'amber' : 'red'

  const prioCount: Record<string, number> = {}
  filtered.forEach(r => r.priorita?.forEach(p => { prioCount[p] = (prioCount[p] ?? 0) + 1 }))
  const prioTop = Object.entries(prioCount).sort((a, b) => b[1] - a[1])

  const soddAvg = avg(filtered.map(r => r.soddisfazione))

  const BUS = ['Tutte le aree', 'Operation & Delivery', 'Sales & Marketing', 'IT (interno, helpdesk)', 'HR', 'Amministrazione', 'Servizi Generali']
  const ANZS = ['Tutte le anzianità', '< 1 anno', '1-2 anni', '3-4 anni', '5-6 anni', '7-8-9 anni', '>= 10 anni']
  const RUOLI = ['Tutti i ruoli', 'Manager', 'Worker']

  const q1Individuals = all.filter(r => {
    const fullName = `${r.nome ?? ''} ${r.cognome ?? ''}`.toLowerCase()
    const searchMatch = !q1Search.trim() || fullName.includes(q1Search.toLowerCase())
    const buMatch = !q1BuFilter || q1BuFilter === 'Tutte le aree' || r.bu === q1BuFilter
    return searchMatch && buMatch
  })

  async function askAI(q: string) {
    if (!q.trim()) return
    setAiLoading(true)
    setAiAnswer(null)
    const context = {
      totaleRispondenti: all.length,
      energiaMediaOggi: termAvg.toFixed(1),
      distribuzioneClima: Object.fromEntries(
        climaOpts.map(o => [o.label, `${all.length ? Math.round((climaCount[o.label] ?? 0) / all.length * 100) : 0}%`])
      ),
      causePrincipali: causeTop.slice(0, 4).map(([label, count]) => ({
        causa: label,
        percentuale: `${all.length ? Math.round(count / all.length * 100) : 0}%`
      })),
      descrizioneEnergia: Object.fromEntries(
        descOpts.map(o => [o.label, `${all.length ? Math.round((descrCount[o.label] ?? 0) / all.length * 100) : 0}%`])
      ),
    }
    try {
      const res = await fetch('/api/dashboard-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, context }),
      })
      const data = await res.json()
      setAiAnswer(data.answer ?? data.error ?? 'Errore imprevisto.')
    } catch {
      setAiAnswer('Errore di rete. Riprova più tardi.')
    } finally {
      setAiLoading(false)
    }
  }

  function downloadReport(r: SurveyResponse) {
    const termColor = (r.termometro ?? 0) >= 8 ? '#17B8A6' : (r.termometro ?? 0) >= 5 ? '#FFB648' : '#FF6E86'
    const climaEmoji: Record<string, string> = { 'Soleggiato': '☀️', 'Parzialmente nuvoloso': '⛅', 'Piovoso': '🌧️', 'Temporalesco': '⛈️' }
    const descrLabel: Record<string, string> = { 'Crescita': '⚡ Energia in Crescita', 'Stabile': '🔋 Energia Stabile', 'Ricarica': '🔌 Energia in Ricarica', 'Assestamento': '🌱 Energia in Assestamento' }
    const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>Report ${r.nome} ${r.cognome}</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 24px; color: #2A2338; }
  h1 { font-size: 22px; font-weight: 700; margin: 0 0 4px; }
  .sub { color: #6B5F7A; font-size: 14px; margin: 0 0 32px; }
  .badge { display: inline-block; background: #FFF3DC; color: #C47800; border-radius: 20px; padding: 3px 12px; font-size: 12px; font-weight: 600; letter-spacing: .05em; margin-bottom: 8px; }
  .section { border: 1px solid #EDE8F5; border-radius: 16px; padding: 20px 24px; margin-bottom: 16px; }
  .section-label { font-size: 11px; font-weight: 700; letter-spacing: .1em; color: #9A93A8; margin: 0 0 6px; }
  .section-q { font-size: 14px; color: #6B5F7A; margin: 0 0 10px; }
  .answer { font-size: 18px; font-weight: 700; color: #2A2338; margin: 0; }
  .answer-big { font-size: 32px; font-weight: 800; color: ${termColor}; margin: 0; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag { background: #F4F1FA; border-radius: 20px; padding: 4px 14px; font-size: 14px; font-weight: 500; }
  .meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
  .meta-chip { background: #F4F1FA; border-radius: 8px; padding: 4px 12px; font-size: 12px; }
  footer { margin-top: 40px; font-size: 12px; color: #9A93A8; border-top: 1px solid #EDE8F5; padding-top: 16px; }
  @media print { body { margin: 20px; } }
</style></head><body>
<div class="badge">OPEN LISTENING · ACTIVE CARE — Report individuale</div>
<h1>${r.nome ?? ''} ${r.cognome ?? ''}</h1>
<p class="sub">Generato il ${new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
<div class="meta">
  ${r.bu ? `<span class="meta-chip">📍 ${r.bu}</span>` : ''}
  ${r.ruolo ? `<span class="meta-chip">👤 ${r.ruolo}</span>` : ''}
  ${r.anzianita ? `<span class="meta-chip">📅 ${r.anzianita}</span>` : ''}
</div>
<div class="section">
  <div class="section-label">CLIMA DEL TEAM · OGGI</div>
  <div class="section-q">Che tempo fa nel tuo team?</div>
  <p class="answer">${climaEmoji[r.clima ?? ''] ?? ''} ${r.clima ?? '—'}</p>
</div>
<div class="section">
  <div class="section-label">TERMOMETRO ENERGETICO · OGGI</div>
  <div class="section-q">Il livello di energia attuale (1–10)</div>
  <p class="answer-big">${r.termometro ?? '—'}<span style="font-size:16px;color:#6B5F7A;font-weight:400">/10</span></p>
</div>
<div class="section">
  <div class="section-label">CAUSE DELL'ENERGIA · OGGI</div>
  <div class="section-q">Cosa influenza di più la tua energia ora?</div>
  <div class="tags">${(r.causa ?? []).map(c => `<span class="tag">${c}</span>`).join('') || '<span style="color:#9A93A8">—</span>'}</div>
</div>
<div class="section">
  <div class="section-label">DESCRIZIONE ENERGIA · ULTIMO ANNO</div>
  <div class="section-q">Come descriveresti la tua energia quest'anno?</div>
  <p class="answer">${r.descrizione ? descrLabel[r.descrizione] ?? r.descrizione : '—'}</p>
</div>
<footer>OT Consulting — Open Listening · Active Care &nbsp;·&nbsp; Documento riservato per uso interno HR</footer>
</body></html>`
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_${r.nome ?? ''}_${r.cognome ?? ''}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="db-page">
      <header className="db-header">
        <span className="db-brand">OPEN LISTENING · ACTIVE CARE</span>
        <div className="db-user-row">
          <span className="db-user-chip">👤 {userEmail}</span>
          <a href="/survey" className="db-logout">Esci →</a>
        </div>
      </header>

      <div className="db-content">
        <div className="db-tabs">
          {isHR && (
            <button className={`db-tab warm${tab === 'q1' ? ' active' : ''}`} onClick={() => setTab('q1')}>🔋 My Energy Battery</button>
          )}
          <button className={`db-tab${tab === 'q2' ? ' active' : ''}`} onClick={() => setTab('q2')}>⚡ Fattori Energy Battery</button>
        </div>

        {tab === 'q1' && (
          <div className="db-tab-body">
            <div className="db-overview-row">
              <div className="db-ov-card">
                <div className="db-ov-label">RISPONDENTI TOTALI</div>
                <div className="db-ov-num">{all.length}</div>
                <div className="db-ov-sub">survey completate</div>
              </div>
              <div className="db-ov-card">
                <div className="db-ov-label">ENERGIA MEDIA</div>
                <div className="db-ov-num amber">{termAvg.toFixed(1)}<span className="db-ov-unit">/10</span></div>
                <div className="db-ov-sub">termometro oggi</div>
              </div>
            </div>

            <div className="db-section-hdr">
              <span className="db-section-pill warm">☀️ My Energy Battery</span>
              <span className="db-section-title">Energia oggi e nell'anno</span>
            </div>

            <div className="db-row-2col">
              <div className="db-card">
                <div className="db-clima-badge">☀️ Clima del team · Oggi</div>
                <div className="db-card-title">Che tempo fa nel tuo team?</div>
                <div className="db-dist-list">
                  {climaOpts.map(o => (
                    <div key={o.label} className="db-dist-row icon">
                      <span className="db-dist-icon">{o.icon}</span>
                      <span className="db-dist-label">{o.label}</span>
                      <div className="db-dist-track">
                        <div className="db-dist-fill" style={{ width: `${all.length ? Math.round((climaCount[o.label] ?? 0) / all.length * 100) : 0}%`, background: o.col }} />
                      </div>
                      <span className="db-dist-pct">{all.length ? Math.round((climaCount[o.label] ?? 0) / all.length * 100) : 0}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="db-card">
                <div className="db-card-eyebrow">TERMOMETRO ENERGETICO · OGGI</div>
                <div className="db-card-title">Il livello di energia attuale</div>
                <div className="db-gauge-row">
                  <div className="db-gauge">
                    <svg viewBox="0 0 100 100" width="90" height="90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(42,35,56,.08)" strokeWidth="10" />
                      <circle cx="50" cy="50" r="42" fill="none"
                        stroke={termAvg >= 7 ? '#17B8A6' : termAvg >= 5 ? '#FFB648' : '#FF6E86'}
                        strokeWidth="10" strokeDasharray={`${(termAvg / 10) * 264} 264`}
                        strokeLinecap="round" transform="rotate(-90 50 50)" />
                      <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="700" fill="#2A2338" fontFamily="Fredoka">{termAvg.toFixed(1)}</text>
                    </svg>
                  </div>
                  <div className="db-gauge-legend">
                    <span className="db-gauge-sub">{termVals.length} risposte</span>
                    <span className="gauge-pill red">🔴 {termVals.filter(v => v <= 4).length} bassa (1–4)</span>
                    <span className="gauge-pill amber">🟡 {termVals.filter(v => v >= 5 && v <= 7).length} media (5–7)</span>
                    <span className="gauge-pill green">🟢 {termVals.filter(v => v >= 8).length} alta (8–10)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="db-card">
              <div className="db-card-eyebrow">CAUSE DELL'ENERGIA · OGGI</div>
              <div className="db-card-title">Cosa influenza di più l'energia?</div>
              <div className="db-dist-list">
                {causeTop.map(([label, count]) => (
                  <DistBar key={label} label={label} count={count} total={all.length} color="#FFB648" />
                ))}
              </div>
            </div>

            <div className="db-card">
              <div className="db-card-eyebrow">DESCRIZIONE ENERGIA · ULTIMO ANNO</div>
              <div className="db-card-title">Come è andata quest'anno?</div>
              <div className="db-dist-list">
                {descOpts.map(o => (
                  <DistBar key={o.label} label={o.label} count={descrCount[o.label] ?? 0} total={all.length} color={o.col} />
                ))}
              </div>
            </div>

            <div className="db-ai-box">
              <div className="db-ai-header">
                <span className="db-ai-icon">✦</span>
                <div>
                  <div className="db-ai-title">Analisi AI</div>
                  <div className="db-ai-sub">Fai una domanda sui dati della survey</div>
                </div>
              </div>

              <div className="db-ai-suggestions">
                {[
                  'Quali sono i principali segnali di rischio per il benessere del team?',
                  'Qual è l\'andamento generale dell\'energia in OT?',
                  'Quale causa di bassa energia emerge più spesso?',
                  'Come posso prepararmi per i colloqui one-to-one?',
                ].map(s => (
                  <button key={s} className="db-ai-chip" onClick={() => { setAiQuestion(s); askAI(s) }}>{s}</button>
                ))}
              </div>

              <div className="db-ai-input-row">
                <input
                  className="db-ai-input"
                  type="text"
                  placeholder="Scrivi la tua domanda…"
                  value={aiQuestion}
                  onChange={e => setAiQuestion(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') askAI(aiQuestion) }}
                />
                <button className="db-ai-send" onClick={() => askAI(aiQuestion)} disabled={aiLoading || !aiQuestion.trim()}>
                  {aiLoading ? '…' : '→'}
                </button>
              </div>

              {aiLoading && (
                <div className="db-ai-loading">
                  <span className="db-ai-dot" /><span className="db-ai-dot" /><span className="db-ai-dot" />
                </div>
              )}
              {aiAnswer && !aiLoading && (
                <div className="db-ai-answer">{aiAnswer}</div>
              )}
            </div>

            <div className="db-individual-box">
              <div className="db-individual-header">
                <div>
                  <div className="db-individual-title">Report individuale · one-to-one</div>
                  <div className="db-individual-sub">Scarica il report di un dipendente per preparare il colloquio</div>
                </div>
              </div>
              <div className="db-individual-filters">
                <div className="db-individual-search-wrap">
                  <svg className="db-search-icon" viewBox="0 0 20 20" fill="none" width="16" height="16">
                    <circle cx="8.5" cy="8.5" r="5.5" stroke="#9A93A8" strokeWidth="1.6"/>
                    <path d="M13 13l3.5 3.5" stroke="#9A93A8" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  <input
                    className="db-individual-search"
                    type="text"
                    placeholder="Cerca per nome o cognome…"
                    value={q1Search}
                    onChange={e => setQ1Search(e.target.value)}
                  />
                  {q1Search && (
                    <button className="db-search-clear" onClick={() => setQ1Search('')}>✕</button>
                  )}
                </div>
                <select className="db-filter-select" value={q1BuFilter || 'Tutte le aree'} onChange={e => setQ1BuFilter(e.target.value)}>
                  {BUS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {q1Individuals.length === 0 ? (
                <div className="db-individual-empty">Nessun rispondente trovato per questa ricerca.</div>
              ) : (
                <div className="db-individual-list">
                  {q1Individuals.map((r, i) => {
                    const termColor = (r.termometro ?? 0) >= 8 ? '#17B8A6' : (r.termometro ?? 0) >= 5 ? '#FFB648' : '#FF6E86'
                    const climaEmoji: Record<string, string> = { 'Soleggiato': '☀️', 'Parzialmente nuvoloso': '⛅', 'Piovoso': '🌧️', 'Temporalesco': '⛈️' }
                    return (
                      <div key={i} className="db-individual-row">
                        <div className="db-individual-avatar">
                          {(r.nome?.[0] ?? '?')}{(r.cognome?.[0] ?? '')}
                        </div>
                        <div className="db-individual-info">
                          <div className="db-individual-name">{r.nome} {r.cognome}</div>
                          <div className="db-individual-meta">
                            {r.bu && <span>{r.bu}</span>}
                            {r.ruolo && <span>· {r.ruolo}</span>}
                          </div>
                        </div>
                        <div className="db-individual-energy">
                          <span className="db-individual-clima">{climaEmoji[r.clima ?? ''] ?? '—'}</span>
                          <span className="db-individual-term" style={{ color: termColor }}>{r.termometro ?? '—'}<span className="db-individual-term-unit">/10</span></span>
                        </div>
                        <button className="db-individual-dl" onClick={() => downloadReport(r)}>
                          <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
                            <path d="M10 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 15h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                          </svg>
                          Report
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="db-individual-count">{q1Individuals.length} di {all.length} rispondenti</div>
            </div>
          </div>
        )}

        {tab === 'q2' && (
          <div className="db-tab-body">
            <div className="db-filters">
              <div className="db-filter-group">
                <label className="db-filter-label">AREA ORGANIZZATIVA</label>
                <select className="db-filter-select" value={buF || 'Tutte le aree'} onChange={e => setBuF(e.target.value)}>
                  {BUS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="db-filter-group">
                <label className="db-filter-label">ANZIANITÀ</label>
                <select className="db-filter-select" value={anzF || 'Tutte le anzianità'} onChange={e => setAnzF(e.target.value)}>
                  {ANZS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="db-filter-group">
                <label className="db-filter-label">RUOLO</label>
                <select className="db-filter-select" value={ruoloF || 'Tutti i ruoli'} onChange={e => setRuoloF(e.target.value)}>
                  {RUOLI.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <span className={`db-n-badge${N < PRIVACY_MIN ? ' warn' : ''}`}>{N} rispondenti</span>
            </div>

            {privacyBlock ? (
              <div className="db-privacy-warn">
                ⚠️ Meno di {PRIVACY_MIN} rispondenti per questa selezione di filtri — i dati aggregati non vengono mostrati per garantire l'anonimato.
              </div>
            ) : (
              <>
                <div className="db-overview-row">
                  <div className="db-ov-card">
                    <div className="db-ov-label">RISPONDENTI</div>
                    <div className="db-ov-num">{N}</div>
                    <div className="db-ov-sub">filtro attivo</div>
                  </div>
                  <div className="db-ov-card">
                    <div className="db-ov-label">NPS SCORE</div>
                    <div className={`db-ov-num ${npsColorClass}`}>{npsScore != null ? (npsScore > 0 ? '+' : '') + npsScore : '—'}</div>
                    <div className="db-ov-sub">promotori – detrattori</div>
                  </div>
                  <div className="db-ov-card">
                    <div className="db-ov-label">PASSIONE PER IL LAVORO</div>
                    <div className="db-ov-num green">{soddAvg.toFixed(1)}<span className="db-ov-unit">/5</span></div>
                    <div className="db-ov-sub">media soddisfazione</div>
                  </div>
                </div>

                <div className="db-section-hdr">
                  <span className="db-section-pill cool">🤝 Relazioni</span>
                  <span className="db-section-title">Le tue relazioni sul lavoro</span>
                </div>
                <LikertCard title="Relazioni interpersonali" eyebrow="COLLEGHI"
                  items={[{ label: 'Collaborazione e supporto tra colleghi', short: 'Supporto colleghi', key: 'relazioni_q' }]}
                  data={filtered} />
                <LikertCard title="Relazione con il/la responsabile" eyebrow="RESPONSABILE"
                  items={[
                    { label: 'Il/la mio/a responsabile mi supporta nella crescita professionale', short: 'Supporto crescita', key: 'referente_crescita' },
                    { label: 'Il/la mio/a responsabile mi dà obiettivi chiari', short: 'Chiarezza obiettivi', key: 'referente_obiettivi' },
                  ]}
                  data={filtered} />
                <LikertCard title="Relazione con HR" eyebrow="HR"
                  items={[
                    { label: 'È facile contattare HR quando ne ho bisogno', short: 'Accessibilità HR', key: 'hr_access' },
                    { label: 'HR aggiunge valore reale al mio percorso lavorativo', short: 'Valore HR', key: 'hr_valore' },
                  ]}
                  data={filtered} />
                <LikertCard title="Management e fiducia" eyebrow="MANAGEMENT"
                  items={[
                    { label: 'Il management comunica in modo trasparente', short: 'Trasparenza', key: 'mgmt_trasp' },
                    { label: 'Mi fido delle decisioni del management', short: 'Fiducia management', key: 'mgmt_fiducia' },
                  ]}
                  data={filtered} />

                <div className="db-section-hdr">
                  <span className="db-section-pill cool">🌱 Crescita</span>
                  <span className="db-section-title">Autonomia e crescita professionale</span>
                </div>
                <LikertCard title="Job crafting" eyebrow="AUTONOMIA"
                  items={[
                    { label: 'Riesco a organizzare il lavoro in modo da renderlo più significativo', short: 'Significatività', key: 'jc_task' },
                    { label: 'Riesco a lavorare in modo che si adatti alle mie competenze', short: 'Adattamento competenze', key: 'jc_schemi' },
                  ]}
                  data={filtered} />
                <LikertCard title="Sviluppo professionale" eyebrow="CRESCITA"
                  items={[
                    { label: 'Ho opportunità concrete di crescere professionalmente in OT', short: 'Opportunità crescita', key: 'sv_crescita' },
                    { label: 'OT investe nel mio sviluppo professionale', short: 'Investimento OT', key: 'sv_investimento' },
                  ]}
                  data={filtered} />
                <LikertCard title="Engagement" eyebrow="COINVOLGIMENTO"
                  items={[{ label: 'Mi sento coinvolto/a e motivato/a nel mio lavoro quotidiano', short: 'Coinvolgimento', key: 'engagement' }]}
                  data={filtered} />

                <div className="db-section-hdr">
                  <span className="db-section-pill cool">💻 Tecnologia & Valori</span>
                  <span className="db-section-title">Strumenti e cultura aziendale</span>
                </div>
                <LikertCard title="Percezione investimento in innovazione" eyebrow="TECNOLOGIA"
                  items={[{ label: "OT investe in modo adeguato nell'innovazione tecnologica", short: 'Innovazione tech', key: 'tecnologia' }]}
                  data={filtered} />

                <div className="db-section-hdr">
                  <span className="db-section-pill cool">⚡ Stress</span>
                  <span className="db-section-title">Carico ed energia lavorativa</span>
                </div>
                <LikertCard title="Stress" eyebrow="SOSTENIBILITÀ E RECUPERO"
                  items={[
                    { label: 'Il carico di lavoro che gestisco quotidianamente è sostenibile', short: 'Sostenibilità del carico', key: 'stress_carico' },
                    { label: 'Riesco a staccare dal lavoro e recuperare le energie nel tempo libero', short: 'Stacco e recupero', key: 'stress_recupero' },
                  ]}
                  data={filtered} />

                <div className="db-section-hdr">
                  <span className="db-section-pill cool">🔭 Prospettive</span>
                  <span className="db-section-title">Follow-up e priorità di miglioramento</span>
                </div>
                <div className="db-card">
                  <div className="db-card-eyebrow">PRIORITÀ DI MIGLIORAMENTO</div>
                  <div className="db-card-title">Cosa vorresti cambiare?</div>
                  <div className="db-dist-list">
                    {prioTop.length ? prioTop.map(([label, count]) => (
                      <DistBar key={label} label={label} count={count} total={N} color="#17B8A6" />
                    )) : <p className="db-empty">Nessun dato</p>}
                  </div>
                </div>

                <div className="db-section-hdr">
                  <span className="db-section-pill cool">🏁 Ultimo step</span>
                  <span className="db-section-title">Soddisfazione e NPS</span>
                </div>
                <LikertCard title="Passione per il lavoro" eyebrow="SODDISFAZIONE LAVORATIVA"
                  items={[{ label: 'Il lavoro che svolgo ogni giorno mi appassiona', key: 'soddisfazione' }]}
                  data={filtered} />
                {npsVals.length > 0 && (
                  <div className="db-card">
                    <div className="db-card-eyebrow">NPS · EMPLOYEE NET PROMOTER SCORE</div>
                    <div className="db-card-title">Quanto raccomanderesti OT come posto di lavoro?</div>
                    <div className={`db-nps-score ${npsColorClass}`}>{npsScore != null ? (npsScore > 0 ? '+' : '') + npsScore : '—'}</div>
                    <div className="db-nps-bar-wrap">
                      <div className="db-nps-bar-d" style={{ width: `${npsVals.length ? Math.round(det / npsVals.length * 100) : 0}%` }} />
                      <div className="db-nps-bar-p" style={{ width: `${npsVals.length ? Math.round(pas / npsVals.length * 100) : 0}%` }} />
                      <div className="db-nps-bar-pro" style={{ width: `${npsVals.length ? Math.round(pro / npsVals.length * 100) : 0}%` }} />
                    </div>
                    <div className="db-nps-segs">
                      <div className="db-nps-seg det"><div className="db-nps-seg-num">{det}</div><div className="db-nps-seg-label">Detrattori (0–6)</div></div>
                      <div className="db-nps-seg pas"><div className="db-nps-seg-num">{pas}</div><div className="db-nps-seg-label">Passivi (7–8)</div></div>
                      <div className="db-nps-seg pro"><div className="db-nps-seg-num">{pro}</div><div className="db-nps-seg-label">Promotori (9–10)</div></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
