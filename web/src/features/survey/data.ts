import type { Phase1Question } from './types'

export const step1: Phase1Question[] = [
  {
    id: 'clima',
    type: 'single-icon',
    title: 'Che tempo fa nel tuo team?',
    sub: '',
    options: [
      { icon: '☀️', label: 'Soleggiato', desc: 'Clima collaborativo, caldo e stimolante' },
      { icon: '⛅', label: 'Parzialmente nuvoloso', desc: 'Tutto sommato stabile, con qualche area di miglioramento' },
      { icon: '🌧️', label: 'Piovoso', desc: "Sotto pressione, stanco, qualche frizione nell'area" },
      { icon: '⛈️', label: 'Temporalesco', desc: 'Forte sovraccarico, stress o conflitti da risolvere' },
    ],
  },
  {
    id: 'termometro',
    type: 'slider',
    title: 'Il termometro della tua energia',
    sub: 'Quanto ti senti carico o scarico in questo periodo?',
    messages: {
      1: ['😴', 'Energia al minimo, ma ogni ricarica parte da qui! Prenderne atto è il primo passo per recuperare forze.'],
      2: ['🪫', 'Carica bassa, ma la determinazione non manca! Un passo alla volta e ritroverai la carica.'],
      3: ['😕', 'Fase di rallentamento, ma ricca di potenziale! Capire cosa ti stanca ti aiuterà a ripartire.'],
      4: ['🥱', 'Stanchezza accumulata, ma grande impegno. Con i giusti ritmi tornerai presto al top.'],
      5: ['😐', 'Equilibrio e ricarica: una base solida da cui ripartire con energia.'],
      6: ['🙂', 'Buon livello di stabilità, avanti così con costanza!'],
      7: ['💪', 'Ottima carica e focus! Affronti le giornate con determinazione.'],
      8: ['🚀', 'Carico/a e super motivato/a! La tua energia fa la differenza per il team.'],
      9: ['🌟', 'Energia e grande entusiasmo! Un riferimento contagioso e propositivo.'],
      10: ['🔥', 'Al massimo della carica e della motivazione! Pronto/a a conquistare ogni traguardo.'],
    },
  },
  {
    id: 'causa',
    type: 'multi-icon',
    max: 2,
    title: 'Cosa influenza di più la tua energia ora?',
    sub: 'Scegli fino a 2 opzioni',
    options: [
      { icon: '🔋', label: 'Carico di lavoro' },
      { icon: '🤝', label: 'Relazioni con colleghi' },
      { icon: '🎯', label: 'Rapporto con il/la responsabile' },
      { icon: '🌱', label: 'Crescita e sviluppo professionale' },
      { icon: '🏠', label: 'Motivi personali/extra-lavorativi' },
      { icon: '🛠️', label: 'Strumenti e organizzazione' },
      { icon: '✏️', label: 'Altro', hasInput: true },
    ],
  },
  {
    id: 'descrizione',
    type: 'single-icon',
    title: "Come descriveresti la tua energia quest'anno?",
    sub: '',
    options: [
      { icon: '⚡', label: 'Energia in Crescita', desc: 'Spinta & propulsione: alta motivazione, voglia di nuove sfide' },
      { icon: '🔋', label: 'Energia Stabile', desc: 'Equilibrio & regolarità: carica costante, ritmo sostenibile' },
      { icon: '🪫', label: 'Energia in Ricarica', desc: 'Bisogno di nuova linfa: carica in calo, serve ricaricare' },
      { icon: '🌱', label: 'Energia in Assestamento', desc: 'Ti stai riorganizzando su nuovi ritmi e priorità' },
    ],
  },
]
