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
  team?: string
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
  sv_crescita?: string[]
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

const PIE_COLORS = ['#17B8A6', '#FFB648', '#4B6BCC', '#FF6E86', '#9A93A8', '#2E86DE']
const PRIO_COLORS = ['#4B6BCC', '#17B8A6', '#FFB648', '#FF6E86', '#6E4CAB', '#2E86DE']

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

const TEAMS_BY_BU: Record<string, string[]> = {
  'Operation & Delivery':          ['SYS', 'APA', 'Team Operations'],
  'Sales & Marketing':             ['Sales', 'Marketing & Comunicazione'],
  'IT (interno, helpdesk)':        ['Helpdesk', 'IT Infrastructure'],
  'HR':                            ['HR Payroll', 'Recruiting & Development', 'Language Specialist'],
  'Servizi generali':              ['Amministrazione', 'Office Coordinator'],
  'Consulenti esterni su One sys': ['Consulenti One sys'],
}

function generateMockData(): SurveyResponse[] {
  const rng = mkRng(0xdeadbeef)
  const bus = Object.keys(TEAMS_BY_BU)
  const anzs = ['< 1 anno', '1-2 anni', '3-4 anni', '5-6 anni', '7-8-9 anni', '>= 10 anni']
  const ruoli = ['Manager', 'Worker']
  const climas = ['Soleggiato', 'Parzialmente nuvoloso', 'Piovoso', 'Temporalesco']
  const descrs = ['Crescita', 'Stabile', 'Ricarica', 'Assestamento']
  const causeOpts = ['Carico di lavoro', 'Relazioni con colleghi', 'Rapporto con il/la responsabile', 'Crescita e sviluppo professionale', 'Strumenti e organizzazione', 'Motivi personali/extra-lavorativi']
  const prioOpts = ['Maggiore chiarezza sugli obiettivi', 'Più supporto dal/dalla responsabile', 'Migliori strumenti di lavoro', 'Più opportunità di crescita', 'Migliorare il clima del team', 'Più equilibrio vita-lavoro']
  const crescitaOpts = ["Le opportunità offerte dall'azienda (formazione, progetti, ruoli)", 'Il supporto del mio responsabile diretto', 'Il confronto con i colleghi', 'La mia iniziativa personale', 'Percorsi di formazione esterni', 'Non sento di stare crescendo professionalmente']
  const nomi = ['Marco', 'Sara', 'Luca', 'Anna', 'Giuseppe', 'Maria', 'Antonio', 'Francesca', 'Davide', 'Elena', 'Matteo', 'Giulia']
  const cognomi = ['Rossi', 'Bianchi', 'Ferrari', 'Esposito', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno']
  const res: SurveyResponse[] = []
  for (let i = 0; i < 60; i++) {
    const seed2 = i * 137 + 42
    const r2 = mkRng(seed2)
    const termo = rng.next(1, 10)
    const bu = rng.pick(bus)
    const team = rng.pick(TEAMS_BY_BU[bu] ?? ['—'])
    res.push({
      nome: r2.pick(nomi), cognome: r2.pick(cognomi),
      clima: rng.pick(climas), termometro: termo,
      causa: rng.pickN(causeOpts, rng.next(1, 2)), descrizione: rng.pick(descrs),
      bu, team, anzianita: rng.pick(anzs), ruolo: rng.pick(ruoli),
      relazioni_q: rng.next(1, 5), referente_crescita: rng.next(1, 5),
      referente_obiettivi: rng.next(1, 5), hr_access: rng.next(1, 5),
      hr_valore: rng.next(1, 5), mgmt_trasp: rng.next(1, 5),
      mgmt_fiducia: rng.next(1, 5), jc_task: rng.next(1, 5),
      jc_schemi: rng.next(1, 5), sv_crescita: rng.pickN(crescitaOpts, rng.next(1, 2)),
      engagement: rng.next(1, 5),
      tecnologia: rng.next(1, 5), stress_carico: rng.next(1, 5),
      stress_recupero: rng.next(1, 5),
      open_listening: rng.next(0, 1) > 0 ? rng.next(1, 5) : undefined,
      priorita: rng.pickN(prioOpts, rng.next(1, 3)),
      soddisfazione: rng.next(1, 5), nps: rng.next(0, 10),
    })
  }
  return res
}

/* ---- Helpers ---- */
function avg(arr: (number | null | undefined)[]): number {
  const v = arr.filter((x): x is number => x != null)
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0
}
function scoreClass(v: number) { return v < 2.6 ? 'red' : v < 3.6 ? 'amber' : 'green' }
function scoreClass10(v: number) { return v < 4 ? 'red' : v < 6.5 ? 'amber' : 'green' }
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

function FactorRow({ label, fieldKey, data }: { label: string; fieldKey: keyof SurveyResponse; data: SurveyResponse[] }) {
  const vals = data.map(r => r[fieldKey] as number | null)
  const mean = avg(vals)
  const n = vals.filter(v => v != null).length
  const distrib = buildDistrib(vals)
  return (
    <div className="db-factor-row">
      <span className="db-factor-label">{label}</span>
      <Strip distrib={distrib} total={n} />
      <span className={`db-factor-score ${scoreClass(mean)}`}>{mean.toFixed(1)}</span>
    </div>
  )
}

function LikertGroup({ items, data }: { items: { label: string; key: keyof SurveyResponse }[]; data: SurveyResponse[] }) {
  const means = items.map(it => avg(data.map(r => r[it.key] as number | null).filter((v): v is number => v != null)))
  const groupAvg = avg(means.filter(m => m > 0))
  return (
    <>
      {items.map(it => <FactorRow key={it.key as string} label={it.label} fieldKey={it.key} data={data} />)}
      {items.length > 1 && groupAvg > 0 && (
        <div className="db-factor-box-avg">
          Media variabile: <strong className={`db-avg-score ${scoreClass(groupAvg)}`}>{groupAvg.toFixed(1)}<span>/5</span></strong>
        </div>
      )}
    </>
  )
}

function PieChart({ slices, size = 72 }: { slices: { label: string; value: number; color: string }[]; size?: number }) {
  const total = slices.reduce((s, sl) => s + sl.value, 0)
  if (total === 0) {
    return <svg width={size} height={size}><circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="#EDE8F5" /></svg>
  }
  const r = (size - 4) / 2
  const cx = size / 2, cy = size / 2
  const endAngles = slices.reduce<number[]>((acc, sl) => {
    const prev = acc.length > 0 ? acc[acc.length - 1] : -Math.PI / 2
    return [...acc, prev + (sl.value / total) * 2 * Math.PI]
  }, [])
  const startAngles = [-Math.PI / 2, ...endAngles.slice(0, -1)]
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {slices.map((sl, i) => {
        if (sl.value === 0) return null
        const a1 = startAngles[i]
        const a2 = endAngles[i]
        const sweep = a2 - a1
        const x1 = cx + r * Math.cos(a1)
        const y1 = cy + r * Math.sin(a1)
        const x2 = cx + r * Math.cos(a2)
        const y2 = cy + r * Math.sin(a2)
        const large = sweep > Math.PI ? 1 : 0
        return (
          <path key={i}
            d={`M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`}
            fill={sl.color}
          />
        )
      })}
      <circle cx={cx} cy={cy} r={r * 0.52} fill="white" />
    </svg>
  )
}

/* ---- Main component ---- */
export function DashboardClient({ userEmail }: { userEmail: string; userRole: 'hr_admin' | 'bu_manager' }) {
  const [buF, setBuF] = useState('')
  const [anzF, setAnzF] = useState('')
  const [ruoloF, setRuoloF] = useState('')
  const [all, setAll] = useState<SurveyResponse[]>([])
  const [q1Search, setQ1Search] = useState('')
  const [aiOpen, setAiOpen] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(LS_SEED_KEY)) {
      localStorage.setItem(LS_KEY, JSON.stringify(generateMockData()))
      localStorage.setItem(LS_SEED_KEY, '1')
    }
    let data: SurveyResponse[] = []
    try { data = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAll(data)
  }, [])

  const filtered = all.filter(r =>
    (!buF || buF === 'Tutte le aree' || r.bu === buF) &&
    (!anzF || anzF === 'Tutte le anzianità' || r.anzianita === anzF) &&
    (!ruoloF || ruoloF === 'Tutti i ruoli' || r.ruolo === ruoloF)
  )
  const N = filtered.length
  const privacyBlock = N < PRIVACY_MIN

  /* ---- Computed: filtered stats for top metric cards ---- */
  const filteredTermVals = filtered.map(r => r.termometro).filter((v): v is number => v != null)
  const filteredTermAvg = avg(filteredTermVals)

  const filteredClimaCount: Record<string, number> = {}
  filtered.forEach(r => { if (r.clima) filteredClimaCount[r.clima] = (filteredClimaCount[r.clima] ?? 0) + 1 })

  const filteredDescrCount: Record<string, number> = {}
  filtered.forEach(r => { if (r.descrizione) filteredDescrCount[r.descrizione] = (filteredDescrCount[r.descrizione] ?? 0) + 1 })
  const filteredDescrPos = N > 0 ? Math.round(((filteredDescrCount['Crescita'] ?? 0) + (filteredDescrCount['Stabile'] ?? 0)) / N * 100) : 0

  /* ---- Computed: icons/options ---- */
  const climaOpts = [
    { label: 'Soleggiato',            icon: '☀️',  col: '#F5C842' },
    { label: 'Parzialmente nuvoloso', icon: '⛅',  col: '#90B8D4' },
    { label: 'Piovoso',               icon: '🌧️', col: '#4A9ED4' },
    { label: 'Temporalesco',          icon: '⛈️', col: '#6E4CAB' },
  ]
  const descOpts = [
    { label: 'Energia in Crescita',    key: 'Crescita',    icon: '⚡', col: '#17B8A6' },
    { label: 'Energia Stabile',        key: 'Stabile',     icon: '🔋', col: '#2E86DE' },
    { label: 'Energia in Ricarica',    key: 'Ricarica',    icon: '🪫', col: '#FFB648' },
    { label: 'Energia in Assestamento',key: 'Assestamento',icon: '🌱', col: '#9A93A8' },
  ]

  /* ---- Computed: NPS ---- */
  const npsVals = filtered.map(r => r.nps).filter((v): v is number => v != null)
  const det = npsVals.filter(v => v <= 6).length
  const pas = npsVals.filter(v => v >= 7 && v <= 8).length
  const pro = npsVals.filter(v => v >= 9).length
  const npsScore = npsVals.length ? Math.round(((pro - det) / npsVals.length) * 100) : null
  const npsColorClass = npsScore == null ? '' : npsScore >= 30 ? 'green' : npsScore >= 0 ? 'amber' : 'red'

  /* ---- Computed: multi-choice ---- */
  const prioCount: Record<string, number> = {}
  filtered.forEach(r => r.priorita?.forEach(p => { prioCount[p] = (prioCount[p] ?? 0) + 1 }))
  const prioTop = Object.entries(prioCount).sort((a, b) => b[1] - a[1])

  const crescitaCount: Record<string, number> = {}
  filtered.forEach(r => r.sv_crescita?.forEach(p => { crescitaCount[p] = (crescitaCount[p] ?? 0) + 1 }))
  const crescitaTop = Object.entries(crescitaCount).sort((a, b) => b[1] - a[1])

  const BUS = ['Tutte le aree', 'Operation & Delivery', 'Sales & Marketing', 'IT (interno, helpdesk)', 'HR', 'Servizi generali', 'Consulenti esterni su One sys']
  const ANZS = ['Tutte le anzianità', '< 1 anno', '1-2 anni', '3-4 anni', '5-6 anni', '7-8-9 anni', '>= 10 anni']
  const RUOLI = ['Tutti i ruoli', 'Manager', 'Worker']

  /* ---- Report search ---- */
  const q1Individuals = all
    .filter(r => {
      const fullName = `${r.nome ?? ''} ${r.cognome ?? ''}`.toLowerCase()
      return !q1Search.trim() || fullName.includes(q1Search.toLowerCase())
    })
    .sort((a, b) => (a.termometro ?? 0) - (b.termometro ?? 0))

  async function askAI(q: string) {
    if (!q.trim()) return
    setAiLoading(true)
    setAiAnswer(null)
    const context = {
      totaleRispondenti: all.length,
      energiaMediaOggi: filteredTermAvg.toFixed(1),
      distribuzioneClima: Object.fromEntries(
        climaOpts.map(o => [o.label, `${N > 0 ? Math.round((filteredClimaCount[o.label] ?? 0) / N * 100) : 0}%`])
      ),
      descrizioneEnergia: Object.fromEntries(
        descOpts.map(o => [o.label, `${N > 0 ? Math.round((filteredDescrCount[o.key] ?? 0) / N * 100) : 0}%`])
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
    const descrLabel: Record<string, string> = { 'Crescita': '⚡ Energia in Crescita', 'Stabile': '🔋 Energia Stabile', 'Ricarica': '🪫 Energia in Ricarica', 'Assestamento': '🌱 Energia in Assestamento' }
    const spunti: string[] = []
    if (t <= 4) spunti.push('Energia bassa: inizia chiedendo come sta davvero, senza presupporre nulla.')
    if (t >= 5 && t <= 7) spunti.push('Energia nella media: esplora cosa potrebbe aumentarla o cosa la frena.')
    if ((r.causa ?? []).includes('Carico di lavoro')) spunti.push('Ha citato il carico di lavoro: chiedi se ci sono priorità da rivedere insieme.')
    if ((r.causa ?? []).includes('Rapporto con il/la responsabile')) spunti.push('Ha citato il rapporto con il/la responsabile: ascolta senza difenderti, fai domande aperte.')
    if ((r.causa ?? []).includes('Crescita e sviluppo professionale')) spunti.push('La crescita professionale è un tema: chiedi dove si vede tra 1-2 anni.')
    if (r.descrizione === 'Ricarica' || r.descrizione === 'Assestamento') spunti.push("L'ultimo anno è stato faticoso: chiedi cosa l'ha sostenuta/o nei momenti difficili.")
    if (r.clima === 'Temporalesco' || r.clima === 'Piovoso') spunti.push('Il clima del team è percepito come difficile: esplora le dinamiche relazionali.')
    if (r.descrizione === 'Crescita') spunti.push('Descrive un anno di crescita: valorizzalo e chiedi come mantenerlo.')
    if (spunti.length === 0) spunti.push('Inizia con una domanda aperta: "Come stai vivendo questo periodo al lavoro?"')
    const barFill = Math.round((t / 10) * 100)
    const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>Report ${r.nome} ${r.cognome}</title>
<style>*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:680px;margin:40px auto;padding:0 28px;color:#2A2338;line-height:1.5}.header-badge{display:inline-block;background:#FFF3DC;color:#C47800;border-radius:20px;padding:4px 14px;font-size:11px;font-weight:700;letter-spacing:.08em;margin-bottom:14px}h1{font-size:26px;font-weight:800;margin:0 0 4px}.sub{color:#9A93A8;font-size:13px;margin:0 0 20px}.meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px}.meta-chip{background:#F4F1FA;border-radius:8px;padding:5px 12px;font-size:12px;font-weight:500;color:#6B5F7A}.hero{background:${termBg};border-radius:20px;padding:24px 28px;margin-bottom:20px;display:flex;align-items:center;gap:28px}.hero-score{font-size:56px;font-weight:900;color:${termColor};line-height:1}.hero-score span{font-size:20px;font-weight:400;color:#9A93A8}.hero-right{flex:1}.hero-label{font-size:11px;font-weight:700;letter-spacing:.1em;color:#9A93A8;margin-bottom:6px}.hero-status{font-size:18px;font-weight:700;color:${termColor};margin-bottom:10px}.bar-wrap{background:#E8E4F0;border-radius:100px;height:8px;overflow:hidden}.bar-fill{height:100%;border-radius:100px;background:${termColor};width:${barFill}%}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px}.section{border:1px solid #EDE8F5;border-radius:16px;padding:18px 20px}.section.full{grid-column:1/-1}.section-label{font-size:10px;font-weight:700;letter-spacing:.1em;color:#9A93A8;margin:0 0 5px;text-transform:uppercase}.answer{font-size:17px;font-weight:700;color:#2A2338;margin:0}.tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.tag{background:#F4F1FA;border-radius:20px;padding:4px 12px;font-size:13px;font-weight:500}.spunti{background:#F8F6FF;border:1px solid #DDD6F8;border-radius:16px;padding:20px 24px;margin-bottom:20px}.spunti-title{font-size:12px;font-weight:700;letter-spacing:.08em;color:#6B5F7A;margin:0 0 14px;text-transform:uppercase}.spunto{display:flex;gap:10px;margin-bottom:10px;font-size:14px;line-height:1.5}.spunto-dot{width:6px;height:6px;border-radius:50%;background:#9B8ECC;margin-top:7px;flex-shrink:0}.note-box{border:1.5px dashed #CCC8D8;border-radius:16px;padding:20px 24px;min-height:120px;margin-bottom:20px}.note-title{font-size:11px;font-weight:700;letter-spacing:.08em;color:#9A93A8;margin:0 0 10px;text-transform:uppercase}footer{margin-top:24px;font-size:11px;color:#9A93A8;border-top:1px solid #EDE8F5;padding-top:14px;display:flex;justify-content:space-between}@media print{body{margin:16px}.note-box{min-height:160px}}</style></head><body>
<div class="header-badge">OPEN LISTENING · ACTIVE CARE — Report one-to-one</div>
<h1>${r.nome ?? ''} ${r.cognome ?? ''}</h1>
<p class="sub">Generato il ${new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })} · Documento riservato HR</p>
<div class="meta">${r.bu ? `<span class="meta-chip">📍 ${r.bu}</span>` : ''}${r.ruolo ? `<span class="meta-chip">👤 ${r.ruolo}</span>` : ''}${r.anzianita ? `<span class="meta-chip">📅 ${r.anzianita}</span>` : ''}</div>
<div class="hero"><div class="hero-score">${t}<span>/10</span></div><div class="hero-right"><div class="hero-label">TERMOMETRO ENERGETICO · OGGI</div><div class="hero-status">Energia ${termLabel}</div><div class="bar-wrap"><div class="bar-fill"></div></div></div></div>
<div class="grid"><div class="section"><div class="section-label">Clima del team · Oggi</div><p class="answer">${climaEmoji[r.clima ?? ''] ?? ''} ${r.clima ?? '—'}</p></div><div class="section"><div class="section-label">Descrizione energia · Ultimo anno</div><p class="answer">${r.descrizione ? descrLabel[r.descrizione] ?? r.descrizione : '—'}</p></div><div class="section full"><div class="section-label">Cause dell'energia · Oggi</div><div class="tags">${(r.causa ?? []).map(c => `<span class="tag">${c}</span>`).join('') || '<span style="color:#9A93A8">—</span>'}</div></div></div>
<div class="spunti"><div class="spunti-title">💬 Spunti per il colloquio</div>${spunti.map(s => `<div class="spunto"><div class="spunto-dot"></div><div>${s}</div></div>`).join('')}</div>
<div class="note-box"><div class="note-title">📝 Note HR — da compilare durante il colloquio</div></div>
<footer><span>OT Consulting — Open Listening · Active Care</span><span>Uso interno riservato · Non distribuire</span></footer>
</body></html>`
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `report_${r.nome ?? ''}_${r.cognome ?? ''}.html`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="db-page">
      <header className="db-header">
        <div className="db-brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ot-logo-icon.svg" alt="OT Consulting" className="db-header-logo" />
          <span className="db-brand">Dashboard HR</span>
        </div>
        <div className="db-user-row">
          <span className="db-user-chip">👤 {userEmail}</span>
          <a href="/survey" className="db-logout">Esci →</a>
        </div>
      </header>

      <div className="db-content">

        {/* Survey completion strip */}
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

        {/* Filtri */}
        <div className="db-filters db-filters-persistent">
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
        </div>

        {/* ── 4 METRIC CARDS ── */}
        <div className="db-metric-row">

          {/* Card 1: Energia Oggi */}
          <div className="db-metric-card">
            <div className="db-mc-eyebrow">ENERGIA OGGI</div>
            <div className={`db-mc-big-value ${scoreClass10(filteredTermAvg)}`}>
              {N > 0 ? filteredTermAvg.toFixed(1) : '—'}
              <span className="db-mc-unit">/10</span>
            </div>
            <div className="db-mc-gauge-wrap">
              <div className="db-mc-gauge-fill" style={{
                width: `${N > 0 ? filteredTermAvg * 10 : 0}%`,
                background: filteredTermAvg >= 6.5 ? '#17B8A6' : filteredTermAvg >= 4 ? '#FFB648' : '#FF6E86'
              }} />
            </div>
            <div className="db-mc-pills">
              <span className="db-mc-pill red">{filteredTermVals.filter(v => v <= 4).length} bassa</span>
              <span className="db-mc-pill amber">{filteredTermVals.filter(v => v >= 5 && v <= 7).length} media</span>
              <span className="db-mc-pill green">{filteredTermVals.filter(v => v >= 8).length} alta</span>
            </div>
            <div className="db-mc-sub">{N} rispondenti · termometro energetico</div>
          </div>

          {/* Card 2: Energia nell'Anno */}
          <div className="db-metric-card">
            <div className="db-mc-eyebrow">ENERGIA NELL&apos;ANNO</div>
            <div className="db-mc-pie-row">
              <PieChart
                slices={descOpts.map(o => ({ label: o.label, value: filteredDescrCount[o.key] ?? 0, color: o.col }))}
                size={72}
              />
              <div className="db-mc-legend">
                {descOpts.map(o => {
                  const n = filteredDescrCount[o.key] ?? 0
                  const pct = N > 0 ? Math.round(n / N * 100) : 0
                  return (
                    <div key={o.key} className="db-mc-legend-row">
                      <span className="db-mc-legend-dot" style={{ background: o.col }} />
                      <span className="db-mc-legend-label">{o.key}</span>
                      <span className="db-mc-legend-pct">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="db-mc-sub">{filteredDescrPos}% energia positiva (Crescita o Stabile)</div>
          </div>

          {/* Card 3: Clima del Team */}
          <div className="db-metric-card">
            <div className="db-mc-eyebrow">CLIMA DEL TEAM</div>
            <div className="db-mc-pie-row">
              <PieChart
                slices={climaOpts.map(o => ({ label: o.label, value: filteredClimaCount[o.label] ?? 0, color: o.col }))}
                size={72}
              />
              <div className="db-mc-legend">
                {climaOpts.map(o => {
                  const n = filteredClimaCount[o.label] ?? 0
                  const pct = N > 0 ? Math.round(n / N * 100) : 0
                  return (
                    <div key={o.label} className="db-mc-legend-row">
                      <span className="db-mc-legend-dot" style={{ background: o.col }} />
                      <span className="db-mc-legend-label">{o.label}</span>
                      <span className="db-mc-legend-pct">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="db-mc-sub">percezione clima · media energia {N > 0 ? filteredTermAvg.toFixed(1) : '—'}/10</div>
          </div>

          {/* Card 4: Report One-to-One */}
          <div className="db-metric-card db-mc-report">
            <div className="db-mc-eyebrow">REPORT ONE-TO-ONE</div>
            <div className="db-mc-report-desc">Scarica il report individuale per il colloquio 1:1</div>
            <div className="db-individual-search-wrap" style={{ marginBottom: 8 }}>
              <svg className="db-search-icon" viewBox="0 0 20 20" fill="none" width="14" height="14">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="#9A93A8" strokeWidth="1.6" />
                <path d="M13 13l3.5 3.5" stroke="#9A93A8" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input className="db-individual-search" type="text" placeholder="Cerca nome o cognome…" value={q1Search} onChange={e => setQ1Search(e.target.value)} />
              {q1Search && <button className="db-search-clear" onClick={() => setQ1Search('')}>✕</button>}
            </div>
            <div className="db-mc-report-list">
              {q1Search.trim().length === 0 ? (
                <div className="db-mc-report-placeholder">Cerca un dipendente per generare il report</div>
              ) : q1Individuals.length === 0 ? (
                <div className="db-mc-report-placeholder">Nessun risultato.</div>
              ) : (
                q1Individuals.slice(0, 5).map((r, i) => {
                  const t = r.termometro ?? 0
                  const termColor = t >= 8 ? '#17B8A6' : t >= 5 ? '#4B6BCC' : '#FF6E86'
                  return (
                    <div key={i} className="db-mc-report-row">
                      <div className="db-mc-report-avatar" style={{ background: termColor + '22', color: termColor }}>
                        {(r.nome?.[0] ?? '?')}{(r.cognome?.[0] ?? '')}
                      </div>
                      <div className="db-mc-report-name">
                        <span>{r.nome} {r.cognome}</span>
                        <span className="db-mc-report-bu">{r.bu}</span>
                      </div>
                      <span className="db-mc-report-score" style={{ color: termColor }}>{t}/10</span>
                      <button className="db-individual-dl" style={{ background: termColor }} onClick={() => downloadReport(r)}>
                        <svg viewBox="0 0 20 20" fill="none" width="12" height="12">
                          <path d="M10 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4 15h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>

        {/* ── FATTORI ENERGY BATTERY ── */}
        <div className="db-section-title-bar">
          <span className="db-section-title-text">Fattori Energy Battery</span>
          {N > 0 && !privacyBlock && <span className="db-section-title-sub">{N} rispondenti · filtro attivo</span>}
          {privacyBlock && <span className="db-privacy-chip">⚠️ meno di {PRIVACY_MIN} rispondenti — dati non mostrati per anonimato</span>}
        </div>

        {!privacyBlock && (
          <div className="db-factors-grid">

            {/* 1. Relazioni interpersonali */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Relazioni interpersonali</span></div>
              <LikertGroup items={[
                { label: 'Le relazioni interpersonali nel mio ambiente di lavoro sono costruttive', key: 'relazioni_q' },
              ]} data={filtered} />
            </div>

            {/* 2. Supporto del Manager */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Supporto del Manager</span></div>
              <LikertGroup items={[
                { label: 'Mi supporta nella mia crescita professionale', key: 'referente_crescita' },
                { label: 'Dà obiettivi strutturati', key: 'referente_obiettivi' },
              ]} data={filtered} />
            </div>

            {/* 3. Supporto HR */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Supporto e valore percepito dell&apos;HR</span></div>
              <LikertGroup items={[
                { label: "L'HR è un punto di riferimento accessibile e disponibile", key: 'hr_access' },
                { label: "Riconosco un valore reale nel supporto che l'HR mi offre", key: 'hr_valore' },
              ]} data={filtered} />
            </div>

            {/* 4. Supporto Management */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Supporto Management</span></div>
              <LikertGroup items={[
                { label: 'Il management comunica in modo trasparente la strategia e le priorità', key: 'mgmt_trasp' },
                { label: 'Ho fiducia nelle scelte strategiche del management', key: 'mgmt_fiducia' },
              ]} data={filtered} />
            </div>

            {/* 5. Jobcrafting */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Jobcrafting</span></div>
              <LikertGroup items={[
                { label: 'Ho la possibilità di proporre nuove modalità per svolgere i miei compiti', key: 'jc_task' },
                { label: 'Mi sento libero/a di sperimentare soluzioni diverse da quelle standard', key: 'jc_schemi' },
              ]} data={filtered} />
            </div>

            {/* 6. Sviluppo Professionale — pie */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Sviluppo Professionale</span></div>
              <div className="db-factor-multi-label">A cosa attribuisci principalmente la tua crescita in OT?</div>
              {crescitaTop.length > 0 ? (
                <div className="db-factor-pie-row">
                  <PieChart slices={crescitaTop.map(([lbl, cnt], i) => ({ label: lbl, value: cnt, color: PIE_COLORS[i % PIE_COLORS.length] }))} size={64} />
                  <div className="db-pie-legend">
                    {crescitaTop.slice(0, 5).map(([lbl, cnt], i) => (
                      <div key={lbl} className="db-pie-legend-row">
                        <span className="db-pie-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="db-pie-label">{lbl}</span>
                        <span className="db-pie-pct">{N > 0 ? Math.round(cnt / N * 100) : 0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : <div className="db-factor-empty">Nessun dato disponibile</div>}
            </div>

            {/* 7. Identificazione valori */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Identificazione con i valori aziendali</span></div>
              <LikertGroup items={[
                { label: 'Mi identifico nei valori e nel modo di lavorare di OT', key: 'engagement' },
              ]} data={filtered} />
            </div>

            {/* 8. Percezione innovazione */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Percezione dell&apos;investimento in innovazione</span></div>
              <LikertGroup items={[
                { label: "OT investe in modo adeguato nell'innovazione tecnologica", key: 'tecnologia' },
              ]} data={filtered} />
            </div>

            {/* 9. Stress */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Stress</span></div>
              <LikertGroup items={[
                { label: 'Il carico di lavoro che gestisco quotidianamente è sostenibile', key: 'stress_carico' },
                { label: 'Riesco a staccare dal lavoro e recuperare le energie nel tempo libero', key: 'stress_recupero' },
              ]} data={filtered} />
            </div>

            {/* 10. Follow-up Open Listening */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Follow-up Open Listening</span></div>
              <LikertGroup items={[
                { label: 'Sono state messe in atto azioni concrete post-ascolto (solo chi ha partecipato)', key: 'open_listening' },
              ]} data={filtered} />
            </div>

            {/* 11. Aree prioritarie — pie */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Aree prioritarie di intervento</span></div>
              <div className="db-factor-multi-label">Cosa vorresti cambiare per incrementare la soddisfazione?</div>
              {prioTop.length > 0 ? (
                <div className="db-factor-pie-row">
                  <PieChart slices={prioTop.map(([lbl, cnt], i) => ({ label: lbl, value: cnt, color: PRIO_COLORS[i % PRIO_COLORS.length] }))} size={64} />
                  <div className="db-pie-legend">
                    {prioTop.slice(0, 5).map(([lbl, cnt], i) => (
                      <div key={lbl} className="db-pie-legend-row">
                        <span className="db-pie-dot" style={{ background: PRIO_COLORS[i % PRIO_COLORS.length] }} />
                        <span className="db-pie-label">{lbl}</span>
                        <span className="db-pie-pct">{N > 0 ? Math.round(cnt / N * 100) : 0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : <div className="db-factor-empty">Nessun dato disponibile</div>}
            </div>

            {/* 12. Soddisfazione */}
            <div className="db-factor-box">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">Soddisfazione – Passione per il lavoro</span></div>
              <LikertGroup items={[
                { label: 'Il lavoro che svolgo ogni giorno mi appassiona', key: 'soddisfazione' },
              ]} data={filtered} />
            </div>

            {/* 13. NPS — largo */}
            <div className="db-factor-box db-factor-box-wide">
              <div className="db-factor-box-hdr"><span className="db-fsh-txt">NPS – Propensione a raccomandare l&apos;azienda</span></div>
              {npsVals.length > 0 ? (
                <>
                  <div className="db-factor-multi-label">Su una scala da 0 a 10, quanto raccomanderesti OT come un buon posto di lavoro?</div>
                  <div className="db-nps-layout">
                    <div className={`db-nps-score ${npsColorClass}`}>
                      {npsScore != null ? (npsScore > 0 ? '+' : '') + npsScore : '—'}
                      <div className="db-nps-score-label">NPS Score</div>
                    </div>
                    <div className="db-nps-bar-block">
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
                    <PieChart slices={[
                      { label: 'Detrattori', value: det, color: '#FF6E86' },
                      { label: 'Passivi',    value: pas, color: '#FFB648' },
                      { label: 'Promotori', value: pro, color: '#17B8A6' },
                    ]} size={72} />
                  </div>
                </>
              ) : <div className="db-factor-empty">Nessun dato disponibile</div>}
            </div>

          </div>
        )}
      </div>

      {/* ---- AI Floating Button + Panel ---- */}
      <button className={`db-ai-fab${aiOpen ? ' open' : ''}`} onClick={() => { setAiOpen(o => !o); setAiAnswer(null); setAiQuestion('') }} aria-label="Analisi AI">
        <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
          <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="currentColor" />
          <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" fill="currentColor" opacity=".6" />
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
              "Com'è l'andamento generale dell'energia?",
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
