import { requireRole } from '@/lib/auth/requireRole'
import { SurveyApp } from '@/features/survey/SurveyApp'

export default async function SurveyPage() {
  await requireRole(['employee', 'hr_admin'])

  return <SurveyApp />
}
