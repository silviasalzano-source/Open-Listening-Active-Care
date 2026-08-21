# Open Listening · Active Care — web app

Scaffold Next.js (App Router, TypeScript) per il pilota. Vedi
`../docs/architettura-proposta-pilota.md` per l'architettura completa.

## Setup locale

1. `npm install`
2. Crea un progetto Supabase gratuito su supabase.com (region UE).
3. Copia `.env.local.example` in `.env.local` e valorizza
   `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` da
   *Project Settings → API* del progetto Supabase.
4. `npm run dev` e apri `http://localhost:3000`.

## Test

`npm run test` (Vitest) — copre la logica pura di controllo accessi
(`src/lib/auth/routeAccess.ts`) e la validazione delle env Supabase
(`src/lib/supabase/env.ts`). La sessione Supabase vera e propria (login,
middleware, pagine server) va verificata manualmente con `npm run dev`,
perché dipende da un progetto Supabase reale.

## Migrazioni database

Le migrazioni SQL vivono in `web/supabase/migrations/`, con naming
`<timestamp>_<nome>.sql` (convenzione compatibile con la Supabase CLI, non
ancora installata in questo progetto). Per applicarle oggi:

1. Apri il progetto Supabase → **SQL Editor**.
2. Esegui i file in `web/supabase/migrations/` **in ordine di timestamp**
   (crescente), uno alla volta.
3. Ogni file di migrazione contiene, nel piano di implementazione che l'ha
   generato (`docs/superpowers/plans/2026-08-21-database-schema-implementation.md`),
   le query di verifica manuale corrispondenti — eseguile dopo ogni
   migrazione per confermare che vincoli/trigger funzionino come previsto.

Se in futuro si installa la Supabase CLI (`supabase link` + `supabase db
push`), questa stessa cartella funziona senza modifiche.

## Collegare Vercel (azione manuale, non scriptabile da qui)

1. Su vercel.com, importa il repository GitHub del progetto.
2. **Root Directory**: imposta `web` (l'app non è alla radice del repo).
3. Aggiungi le stesse variabili d'ambiente di `.env.local` nelle
   impostazioni del progetto Vercel (Environment Variables).
4. Da questo momento, ogni push su `main` fa un deploy di produzione, ogni
   PR ha una preview automatica — non serve una pipeline custom per questo,
   lo gestisce l'integrazione nativa Vercel-GitHub.

## Cosa manca ancora (fuori scope di questo scaffold)

- Porting del contenuto del prototipo HTML in `/survey`.
- Metriche reali della dashboard `/admin` (da definire con HR).
- Schema/migrazioni del database Supabase e relativa pipeline di CD — vedi
  `docs/architettura-proposta-pilota.md` sezione 6 per il modello dati
  previsto.
- Provisioning reale di utenti dipendenti/HR (flusso di invito).
- Migrazione da `middleware.ts` a `proxy.ts`: Next.js ha deprecato la
  convenzione `middleware.ts` a favore di `proxy.ts` (stessa logica, nome
  diverso). Nella versione di Next.js attualmente usata funziona ancora, ma
  va migrata prima di aggiornare alla major che rimuove la vecchia
  convenzione.
