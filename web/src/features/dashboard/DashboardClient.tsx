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
const TOTAL_INVITED = 80

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
  const [q1EnergyFilter, setQ1EnergyFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all')
  const [aiOpen, setAiOpen] = useState(false)
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
    { label: 'Energia in Crescita', key: 'Crescita', icon: '⚡', col: '#17B8A6' },
    { label: 'Energia Stabile', key: 'Stabile', icon: '🔋', col: '#2E86DE' },
    { label: 'Energia in Ricarica', key: 'Ricarica', icon: '🔌', col: '#FFB648' },
    { label: 'Energia in Assestamento', key: 'Assestamento', icon: '🌱', col: '#9A93A8' },
  ]
  const descrCount: Record<string, number> = {}
  all.forEach(r => { if (r.descrizione) descrCount[r.descrizione] = (descrCount[r.descrizione] ?? 0) + 1 })

  const climaPositivoN = (climaCount['Soleggiato'] ?? 0) + (climaCount['Parzialmente nuvoloso'] ?? 0)
  const climaPositivoPct = all.length ? Math.round(climaPositivoN / all.length * 100) : 0
  const climaTop = climaOpts.reduce((a, b) => (climaCount[a.label] ?? 0) >= (climaCount[b.label] ?? 0) ? a : b)

  const descrPositivoN = (descrCount['Crescita'] ?? 0) + (descrCount['Stabile'] ?? 0)
  const descrPositivoPct = all.length ? Math.round(descrPositivoN / all.length * 100) : 0
  const descrTop = descOpts.reduce((a, b) => (descrCount[a.key] ?? 0) >= (descrCount[b.key] ?? 0) ? a : b)

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

  const q1Individuals = all
    .filter(r => {
      const fullName = `${r.nome ?? ''} ${r.cognome ?? ''}`.toLowerCase()
      const searchMatch = !q1Search.trim() || fullName.includes(q1Search.toLowerCase())
      const buMatch = !q1BuFilter || q1BuFilter === 'Tutte le aree' || r.bu === q1BuFilter
      const t = r.termometro ?? 0
      const energyMatch = q1EnergyFilter === 'all' || (q1EnergyFilter === 'low' && t <= 4) || (q1EnergyFilter === 'mid' && t >= 5 && t <= 7) || (q1EnergyFilter === 'high' && t >= 8)
      return searchMatch && buMatch && energyMatch
    })
    .sort((a, b) => (a.termometro ?? 0) - (b.termometro ?? 0))

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
        descOpts.map(o => [o.label, `${all.length ? Math.round((descrCount[o.key] ?? 0) / all.length * 100) : 0}%`])
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
    const t = r.termometro ?? 0
    const termColor = t >= 8 ? '#17B8A6' : t >= 5 ? '#4B6BCC' : '#FF6E86'
    const termLabel = t >= 8 ? 'Alta' : t >= 5 ? 'Media' : 'Bassa'
    const termBg = t >= 8 ? '#E8FAF7' : t >= 5 ? '#EEF2FF' : '#FFF0F3'
    const climaEmoji: Record<string, string> = { 'Soleggiato': '☀️', 'Parzialmente nuvoloso': '⛅', 'Piovoso': '🌧️', 'Temporalesco': '⛈️' }
    const descrLabel: Record<string, string> = { 'Crescita': '⚡ Energia in Crescita', 'Stabile': '🔋 Energia Stabile', 'Ricarica': '🔌 Energia in Ricarica', 'Assestamento': '🌱 Energia in Assestamento' }

    // Spunti di conversazione generati dai dati
    const spunti: string[] = []
    if (t <= 4) spunti.push('Energia bassa: inizia chiedendo come sta davvero, senza presupporre nulla. Dai spazio prima di entrare nei dettagli.')
    if (t >= 5 && t <= 7) spunti.push('Energia nella media: esplora cosa potrebbe aumentarla o cosa la frena. Chiedi cosa manca per sentirsi davvero bene al lavoro.')
    if ((r.causa ?? []).includes('Carico di lavoro')) spunti.push('Ha citato il carico di lavoro come fattore: chiedi se ci sono priorità da rivedere insieme o attività da redistribuire.')
    if ((r.causa ?? []).includes('Rapporto con il/la responsabile')) spunti.push('Ha citato il rapporto con il/la responsabile: ascolta senza difendersi, fai domande aperte e prenditi del tempo per capire la prospettiva.')
    if ((r.causa ?? []).includes('Mancanza di crescita professionale') || (r.causa ?? []).includes('Crescita e sviluppo professionale')) spunti.push('La crescita professionale è un tema presente: chiedi dove si vede tra 1-2 anni e cosa potrebbe aiutarla/lo ad arrivarci.')
    if (r.descrizione === 'Ricarica' || r.descrizione === 'Assestamento') spunti.push("L'ultimo anno è stato faticoso: chiedi cosa l'ha sostenuta/o nei momenti difficili e cosa si aspetta dal prossimo periodo.")
    if (r.clima === 'Temporalesco' || r.clima === 'Piovoso') spunti.push('Il clima del team è percepito come difficile: esplora se ci sono dinamiche relazionali o organizzative da affrontare.')
    if (r.descrizione === 'Crescita') spunti.push('Descrive un anno di crescita: valorizzalo, chiedi cosa ha reso possibile questo risultato e come mantenerlo.')
    if (spunti.length === 0) spunti.push('Inizia con una domanda aperta: "Come stai vivendo questo periodo al lavoro?" — lascia che sia lei/lui a scegliere il punto di partenza.')

    const barFill = Math.round((t / 10) * 100)

    const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>Report ${r.nome} ${r.cognome}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 680px; margin: 40px auto; padding: 0 28px; color: #2A2338; line-height: 1.5; }
  .header-badge { display: inline-block; background: #FFF3DC; color: #C47800; border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; letter-spacing: .08em; margin-bottom: 14px; }
  h1 { font-size: 26px; font-weight: 800; margin: 0 0 4px; }
  .sub { color: #9A93A8; font-size: 13px; margin: 0 0 20px; }
  .meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
  .meta-chip { background: #F4F1FA; border-radius: 8px; padding: 5px 12px; font-size: 12px; font-weight: 500; color: #6B5F7A; }
  .hero { background: ${termBg}; border-radius: 20px; padding: 24px 28px; margin-bottom: 20px; display: flex; align-items: center; gap: 28px; }
  .hero-score { font-size: 56px; font-weight: 900; color: ${termColor}; line-height: 1; }
  .hero-score span { font-size: 20px; font-weight: 400; color: #9A93A8; }
  .hero-right { flex: 1; }
  .hero-label { font-size: 11px; font-weight: 700; letter-spacing: .1em; color: #9A93A8; margin-bottom: 6px; }
  .hero-status { font-size: 18px; font-weight: 700; color: ${termColor}; margin-bottom: 10px; }
  .bar-wrap { background: #E8E4F0; border-radius: 100px; height: 8px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 100px; background: ${termColor}; width: ${barFill}%; }
  .bar-labels { display: flex; justify-content: space-between; font-size: 10px; color: #9A93A8; margin-top: 4px; }
  .hero-vs { font-size: 12px; color: #9A93A8; margin-top: 8px; }
  .hero-vs strong { color: #2A2338; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
  .section { border: 1px solid #EDE8F5; border-radius: 16px; padding: 18px 20px; }
  .section.full { grid-column: 1 / -1; }
  .section-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; color: #9A93A8; margin: 0 0 5px; text-transform: uppercase; }
  .section-q { font-size: 12px; color: #9A93A8; margin: 0 0 10px; }
  .answer { font-size: 17px; font-weight: 700; color: #2A2338; margin: 0; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .tag { background: #F4F1FA; border-radius: 20px; padding: 4px 12px; font-size: 13px; font-weight: 500; }
  .spunti { background: #F8F6FF; border: 1px solid #DDD6F8; border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; }
  .spunti-title { font-size: 12px; font-weight: 700; letter-spacing: .08em; color: #6B5F7A; margin: 0 0 14px; text-transform: uppercase; }
  .spunto { display: flex; gap: 10px; margin-bottom: 10px; font-size: 14px; line-height: 1.5; }
  .spunto:last-child { margin-bottom: 0; }
  .spunto-dot { width: 6px; height: 6px; border-radius: 50%; background: #9B8ECC; margin-top: 7px; flex-shrink: 0; }
  .note-box { border: 1.5px dashed #CCC8D8; border-radius: 16px; padding: 20px 24px; min-height: 120px; margin-bottom: 20px; }
  .note-title { font-size: 11px; font-weight: 700; letter-spacing: .08em; color: #9A93A8; margin: 0 0 10px; text-transform: uppercase; }
  footer { margin-top: 24px; font-size: 11px; color: #9A93A8; border-top: 1px solid #EDE8F5; padding-top: 14px; display: flex; justify-content: space-between; }
  @media print { body { margin: 16px; } .note-box { min-height: 160px; } }
</style></head><body>
<div class="header-badge">OPEN LISTENING · ACTIVE CARE — Report one-to-one</div>
<h1>${r.nome ?? ''} ${r.cognome ?? ''}</h1>
<p class="sub">Generato il ${new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })} · Documento riservato HR</p>
<div class="meta">
  ${r.bu ? `<span class="meta-chip">📍 ${r.bu}</span>` : ''}
  ${r.ruolo ? `<span class="meta-chip">👤 ${r.ruolo}</span>` : ''}
  ${r.anzianita ? `<span class="meta-chip">📅 ${r.anzianita}</span>` : ''}
</div>

<div class="hero">
  <div class="hero-score">${t}<span>/10</span></div>
  <div class="hero-right">
    <div class="hero-label">TERMOMETRO ENERGETICO · OGGI</div>
    <div class="hero-status">Energia ${termLabel}</div>
    <div class="bar-wrap"><div class="bar-fill"></div></div>
    <div class="bar-labels"><span>1</span><span>5</span><span>10</span></div>
    <div class="hero-vs">Media del team: <strong>${termAvg.toFixed(1)}/10</strong> · Scarto: <strong style="color:${t >= termAvg ? '#17B8A6' : '#FF6E86'}">${t >= termAvg ? '+' : ''}${(t - termAvg).toFixed(1)}</strong></div>
  </div>
</div>

<div class="grid">
  <div class="section">
    <div class="section-label">Clima del team · Oggi</div>
    <div class="section-q">Che tempo fa nel tuo team?</div>
    <p class="answer">${climaEmoji[r.clima ?? ''] ?? ''} ${r.clima ?? '—'}</p>
  </div>
  <div class="section">
    <div class="section-label">Descrizione energia · Ultimo anno</div>
    <div class="section-q">Come descriveresti la tua energia quest'anno?</div>
    <p class="answer">${r.descrizione ? descrLabel[r.descrizione] ?? r.descrizione : '—'}</p>
  </div>
  <div class="section full">
    <div class="section-label">Cause dell'energia · Oggi</div>
    <div class="section-q">Cosa influenza di più la tua energia ora?</div>
    <div class="tags">${(r.causa ?? []).map(c => `<span class="tag">${c}</span>`).join('') || '<span style="color:#9A93A8">—</span>'}</div>
  </div>
</div>

<div class="spunti">
  <div class="spunti-title">💬 Spunti per il colloquio</div>
  ${spunti.map(s => `<div class="spunto"><div class="spunto-dot"></div><div>${s}</div></div>`).join('')}
</div>

<div class="note-box">
  <div class="note-title">📝 Note HR — da compilare durante il colloquio</div>
</div>

<footer>
  <span>OT Consulting — Open Listening · Active Care</span>
  <span>Uso interno riservato · Non distribuire</span>
</footer>
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
        <div className="db-brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ot-logo-icon.svg" alt="OT Consulting" className="db-header-logo" />
          <span className="db-brand">Dashboard Open Listening · <strong>ACTIVE CARE</strong></span>
        </div>
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

        <div className="db-survey-strip">
          <div className="db-survey-stat">
            <span className="db-survey-stat-num">{all.length}</span>
            <span className="db-survey-stat-label">survey completate</span>
          </div>
          <div className="db-survey-divider" />
          <div className="db-survey-stat pending">
            <span className="db-survey-stat-num">{Math.max(0, TOTAL_INVITED - all.length)}</span>
            <span className="db-survey-stat-label">da completare</span>
          </div>
          <div className="db-survey-divider" />
          <div className="db-survey-stat">
            <span className="db-survey-stat-num">{TOTAL_INVITED}</span>
            <span className="db-survey-stat-label">inviti inviati</span>
          </div>
          <div className="db-survey-progress-wrap">
            <div className="db-survey-progress-bar" style={{ width: `${Math.round(all.length / TOTAL_INVITED * 100)}%` }} />
            <span className="db-survey-progress-pct">{Math.round(all.length / TOTAL_INVITED * 100)}% completamento</span>
          </div>
        </div>

        {tab === 'q1' && (
          <div className="db-tab-body">
            <div className="db-section-hdr">
              <span className="db-section-title">Energia oggi e nell'anno</span>
            </div>

            <div className="db-row-2col">
              {(() => {
                const neg = (climaCount['Piovoso'] ?? 0) + (climaCount['Temporalesco'] ?? 0)
                const negPct = all.length ? Math.round(neg / all.length * 100) : 0
                const sev = negPct >= 40 ? 'red' : negPct >= 20 ? 'amber' : 'green'
                const statusText = sev === 'red'
                  ? `${negPct}% riporta clima difficile`
                  : sev === 'amber'
                  ? `${negPct}% segnala pressione — monitora`
                  : `${100 - negPct}% vive un clima positivo`
                return (
                  <div className={`db-card alert-${sev}`}>
                    <div className={`db-card-badge sev-${sev}`}>☀️ Clima del team · Oggi</div>
                    <div className="db-card-title">Che tempo fa nel tuo team?</div>
                    <div className="db-card-status">{statusText}</div>
                    <div className="db-dist-list">
                      {climaOpts.map(o => {
                        const n = climaCount[o.label] ?? 0
                        const pct = all.length ? Math.round(n / all.length * 100) : 0
                        return (
                          <div key={o.label} className="db-dist-row icon">
                            <span className="db-dist-icon">{o.icon}</span>
                            <span className="db-dist-label">{o.label}</span>
                            <div className="db-dist-track">
                              <div className="db-dist-fill" style={{ width: `${pct}%`, background: o.col }} />
                            </div>
                            <span className="db-dist-count">{n}</span>
                            <span className="db-dist-pct">{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              {(() => {
                const sev = termAvg < 5 ? 'red' : termAvg < 6.5 ? 'amber' : 'green'
                const statusText = sev === 'red'
                  ? `Media ${termAvg.toFixed(1)}/10 — livello critico`
                  : sev === 'amber'
                  ? `${termVals.filter(v => v <= 4).length} persone sotto soglia (1–4)`
                  : `${termVals.filter(v => v >= 8).length} persone ad alta energia (8–10)`
                return (
                  <div className={`db-card alert-${sev}`}>
                    <div className={`db-card-badge sev-${sev}`}>⚡ Termometro energetico · Oggi</div>
                    <div className="db-card-title">Il livello di energia attuale</div>
                    <div className="db-card-status">{statusText}</div>
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
                )
              })()}
            </div>

            {(() => {
              const [topCausa, topN] = causeTop[0] ?? ['—', 0]
              const topPct = all.length ? Math.round(topN / all.length * 100) : 0
              const isNeg = ['Carico di lavoro', 'Rapporto con il/la responsabile'].includes(topCausa)
              const sev = isNeg ? 'red' : 'amber'
              const statusText = isNeg
                ? `"${topCausa}" è la causa principale (${topPct}%)`
                : `Causa prevalente: "${topCausa}" (${topPct}%)`
              return (
                <div className={`db-card alert-${sev}`}>
                  <div className={`db-card-badge sev-${sev}`}>🔍 Cause dell&apos;energia · Oggi</div>
                  <div className="db-card-title">Cosa influenza di più l&apos;energia?</div>
                  <div className="db-card-status">{statusText}</div>
                  <div className="db-dist-list">
                    {causeTop.map(([label, count]) => (
                      <DistBar key={label} label={label} count={count} total={all.length} color="#FFB648" />
                    ))}
                  </div>
                </div>
              )
            })()}

            {(() => {
              const recuperoPct = 100 - descrPositivoPct
              const sev = recuperoPct >= 50 ? 'red' : recuperoPct >= 30 ? 'amber' : 'green'
              const statusText = sev === 'red'
                ? `${recuperoPct}% in recupero o assestamento`
                : sev === 'amber'
                ? `${recuperoPct}% ha vissuto un anno faticoso`
                : `${descrPositivoPct}% descrive un anno positivo`
              return (
                <div className={`db-card alert-${sev}`}>
                  <div className={`db-card-badge sev-${sev}`}>🌱 Descrizione energia · Ultimo anno</div>
                  <div className="db-card-title">Come è andata quest&apos;anno?</div>
                  <div className="db-card-status">{statusText}</div>
                  <div className="db-dist-list">
                    {descOpts.map(o => {
                      const n = descrCount[o.key] ?? 0
                      const pct = all.length ? Math.round(n / all.length * 100) : 0
                      return (
                        <div key={o.label} className="db-dist-row">
                          <span className="db-dist-label">{o.icon} {o.label}</span>
                          <div className="db-dist-track">
                            <div className="db-dist-fill" style={{ width: `${pct}%`, background: o.col }} />
                          </div>
                          <span className="db-dist-count">{n}</span>
                          <span className="db-dist-pct">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

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
              <div className="db-energy-pills">
                {([['all', 'Tutti'], ['low', '🔴 Energia bassa'], ['mid', '🔵 Energia media'], ['high', '🟢 Energia alta']] as const).map(([val, label]) => (
                  <button key={val} data-val={val} className={`db-energy-pill${q1EnergyFilter === val ? ' active' : ''}`} onClick={() => setQ1EnergyFilter(val)}>
                    {label}
                  </button>
                ))}
                <span className="db-sort-note">↑ ordinate per energia</span>
              </div>

              {q1Search.trim().length === 0 ? (
                <div className="db-individual-placeholder">
                  <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
                    <circle cx="20" cy="20" r="14" stroke="#CCC8D8" strokeWidth="2.5"/>
                    <path d="M30 30l10 10" stroke="#CCC8D8" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  <div>Cerca un dipendente per nome o cognome<br/><span>Usa i filtri sopra per restringere l'area o il livello di energia</span></div>
                </div>
              ) : q1Individuals.length === 0 ? (
                <div className="db-individual-placeholder">
                  <div>Nessun rispondente corrisponde alla ricerca.</div>
                </div>
              ) : (
                <>
                  <div className="db-individual-results-count">{q1Individuals.length} {q1Individuals.length === 1 ? 'risultato' : 'risultati'}</div>
                  <div className="db-quickview-list">
                    {q1Individuals.map((r, i) => {
                      const t = r.termometro ?? 0
                      const termColor = t >= 8 ? '#17B8A6' : t >= 5 ? '#4B6BCC' : '#FF6E86'
                      const termBg = t >= 8 ? 'rgba(23,184,166,.10)' : t >= 5 ? 'rgba(75,107,204,.10)' : 'rgba(255,110,134,.10)'
                      const termLabel = t >= 8 ? 'Alta' : t >= 5 ? 'Media' : 'Bassa'
                      const avatarBg = t >= 8 ? 'rgba(23,184,166,.15)' : t >= 5 ? 'rgba(75,107,204,.15)' : 'rgba(255,110,134,.15)'
                      const avatarColor = t >= 8 ? '#0A7A6B' : t >= 5 ? '#2A4A99' : '#B8003A'
                      const climaEmoji: Record<string, string> = { 'Soleggiato': '☀️', 'Parzialmente nuvoloso': '⛅', 'Piovoso': '🌧️', 'Temporalesco': '⛈️' }
                      const descrShort: Record<string, string> = { 'Crescita': '⚡ Crescita', 'Stabile': '🔋 Stabile', 'Ricarica': '🔌 Ricarica', 'Assestamento': '🌱 Assestamento' }
                      return (
                        <div key={i} className="db-quickview-card">
                          <div className="db-qv-header">
                            <div className="db-individual-avatar" style={{ background: avatarBg, color: avatarColor, width: 40, height: 40, fontSize: 14 }}>
                              {(r.nome?.[0] ?? '?')}{(r.cognome?.[0] ?? '')}
                            </div>
                            <div className="db-qv-identity">
                              <div className="db-individual-name">{r.nome} {r.cognome}</div>
                              <div className="db-individual-meta">
                                {r.bu && <span>{r.bu}</span>}
                                {r.ruolo && <span>· {r.ruolo}</span>}
                                {r.anzianita && <span>· {r.anzianita}</span>}
                              </div>
                            </div>
                            <button className="db-individual-dl" onClick={() => downloadReport(r)}>
                              <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
                                <path d="M10 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M4 15h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                              </svg>
                              Report
                            </button>
                          </div>
                          <div className="db-qv-body">
                            <div className="db-qv-energy" style={{ background: termBg }}>
                              <span className="db-qv-score" style={{ color: termColor }}>{t}<span className="db-qv-score-unit">/10</span></span>
                              <div className="db-qv-energy-right">
                                <div className="db-qv-energy-label" style={{ color: termColor }}>Energia {termLabel}</div>
                                <div className="db-qv-bar-wrap">
                                  <div className="db-qv-bar-fill" style={{ width: `${t * 10}%`, background: termColor }} />
                                </div>
                              </div>
                              <span className="db-qv-clima">{climaEmoji[r.clima ?? ''] ?? '—'}</span>
                            </div>
                            <div className="db-qv-data-row">
                              <div className="db-qv-data-item">
                                <div className="db-qv-data-label">Anno</div>
                                <div className="db-qv-data-val">{r.descrizione ? descrShort[r.descrizione] ?? r.descrizione : '—'}</div>
                              </div>
                              <div className="db-qv-data-item">
                                <div className="db-qv-data-label">Cause</div>
                                <div className="db-qv-tags">
                                  {(r.causa ?? []).map(c => <span key={c} className="db-qv-tag">{c}</span>)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
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

      {/* ---- AI Floating Button + Panel ---- */}
      <button className={`db-ai-fab${aiOpen ? ' open' : ''}`} onClick={() => { setAiOpen(o => !o); setAiAnswer(null); setAiQuestion('') }} aria-label="Analisi AI">
        <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
          <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="currentColor"/>
          <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" fill="currentColor" opacity=".6"/>
        </svg>
      </button>

      {aiOpen && (
        <div className="db-ai-panel">
          <div className="db-ai-panel-header">
            <span className="db-ai-panel-icon">✦</span>
            <span className="db-ai-panel-title">Analisi AI</span>
            <button className="db-ai-panel-close" onClick={() => setAiOpen(false)}>✕</button>
          </div>
          <div className="db-ai-welcome">Come posso aiutarti nell&apos;analisi?</div>
          <div className="db-ai-suggestions">
            {[
              'Quali sono i principali segnali di rischio?',
              'Com\'è l\'andamento generale dell\'energia?',
              'Quale causa di bassa energia emerge più spesso?',
              'Come preparo i colloqui one-to-one?',
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
              autoFocus
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
      )}
    </div>
  )
}
