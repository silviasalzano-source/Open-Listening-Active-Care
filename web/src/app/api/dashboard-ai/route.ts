import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { question, context } = await req.json()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key non configurata.' }, { status: 500 })
  }

  const systemPrompt = `Sei un assistente HR esperto nell'analisi di survey aziendali per OT Consulting.
Hai accesso ai dati aggregati della survey "Open Listening · Active Care — My Energy Battery", compilata dai dipendenti di OT Consulting.

Dati disponibili:
${JSON.stringify(context, null, 2)}

Istruzioni:
- Rispondi sempre in italiano, con tono professionale ma diretto
- Sii conciso: max 4-5 frasi
- Fornisci insight concreti e actionable per l'HR
- Se i dati non sono sufficienti per rispondere, dillo chiaramente
- Non inventare dati non presenti nel contesto`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }],
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Errore del servizio AI. Riprova più tardi.' }, { status: 500 })
  }

  const data = await response.json()
  const answer = data.content?.[0]?.text ?? 'Nessuna risposta disponibile.'
  return NextResponse.json({ answer })
}
