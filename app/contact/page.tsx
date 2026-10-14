import { ContactClient } from './contact-client'
import { getActiveTraining, TrainingTimesSection } from '@/components/features/training-times'

export const revalidate = 60

export default async function ContactPage() {
  const sessions = await getActiveTraining()
  return <ContactClient trainingBlock={<TrainingTimesSection sessions={sessions} />} />
}
