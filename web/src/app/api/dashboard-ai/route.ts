import { NextRequest, NextResponse } from 'next/server'

const MOCK_RESPONSES: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ['rischio', 'rischi', 'segnali', 'alert', 'attenzione', 'preoccup'],
    answer: 'I principali segnali di attenzione emergono nel cluster "energia bassa" (1–4): circa il 18% dei rispondenti si trova in questa fascia. Le cause più citate in questo gruppo sono il carico di lavoro eccessivo e la mancanza di crescita professionale. Si consiglia di pianificare colloqui one-to-one prioritari per questi profili.',
  },
  {
    keywords: ['andamento', 'generale', 'energia', 'complessivo', 'stato', 'ot'],
    answer: 'L\'energia complessiva di OT si attesta su un livello medio-buono, con una media del termometro superiore a 6/10. La maggioranza dei rispondenti descrive l\'anno come "Stabile" o "Crescita", il che indica un clima sostanzialmente positivo. Rimane una quota di persone in fase di "Ricarica" da monitorare nel prossimo semestre.',
  },
  {
    keywords: ['causa', 'cause', 'bassa', 'influenza', 'fattore', 'fattori', 'emerge'],
    answer: 'La causa più frequente di energia ridotta è il carico di lavoro, seguita dal rapporto con il/la responsabile e dalla mancanza di opportunità di crescita. Questi tre fattori ricorrono in oltre il 60% delle risposte e suggeriscono aree di intervento prioritarie per HR e management.',
  },
  {
    keywords: ['colloquio', 'one-to-one', 'prepara', 'incontro', 'dipendente'],
    answer: 'Per preparare un colloquio one-to-one efficace, scarica il report individuale del dipendente (sezione qui sotto) e osserva: il livello termometro, il clima percepito nel team e le cause di energia indicate. Usa questi dati come punto di partenza per la conversazione, senza dare per scontato nulla — chiedere è sempre meglio che interpretare.',
  },
  {
    keywords: ['clima', 'team', 'tempo', 'meteo'],
    answer: 'Il clima del team è prevalentemente "Soleggiato" o "Parzialmente nuvoloso" per la maggioranza dei rispondenti. La presenza di rispondenti con clima "Temporalesco" o "Piovoso" indica tensioni localizzate che meritano attenzione. Valuta se si concentrano in una BU o fascia di anzianità specifica.',
  },
]

const DEFAULT_ANSWER = 'In base ai dati disponibili non ho un\'analisi specifica per questa domanda. Prova a riformularla in modo più mirato — ad esempio chiedendo delle cause di energia, del clima del team o di come preparare i colloqui one-to-one.'

export async function POST(req: NextRequest) {
  const { question } = await req.json() as { question: string }
  const q = question.toLowerCase()

  await new Promise(r => setTimeout(r, 900))

  const match = MOCK_RESPONSES.find(m => m.keywords.some(k => q.includes(k)))
  const answer = match?.answer ?? DEFAULT_ANSWER

  return NextResponse.json({ answer })
}
