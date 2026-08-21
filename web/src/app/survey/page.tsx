import { requireRole } from '@/lib/auth/requireRole'

export default async function SurveyPage() {
  const { user } = await requireRole(['employee', 'hr_admin'])

  return (
    <main>
      <h1>Survey</h1>
      <p>
        Placeholder — qui verrà portato il contenuto del prototipo
        (Open_Listening_Active_Care_Prototype.html) in una fase successiva.
      </p>
      <p>Accesso effettuato come: {user.email}</p>
    </main>
  )
}
