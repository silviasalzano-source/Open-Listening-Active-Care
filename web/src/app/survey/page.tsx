import { createClient } from '@/lib/supabase/server'

export default async function SurveyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main>
      <h1>Survey</h1>
      <p>
        Placeholder — qui verrà portato il contenuto del prototipo
        (Open_Listening_Active_Care_Prototype.html) in una fase successiva.
      </p>
      <p>Accesso effettuato come: {user?.email}</p>
    </main>
  )
}
