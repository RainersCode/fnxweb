import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { Fixture } from '@/types/supabase'
import { FixturesClient } from './fixtures-client'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Spēles & Rezultāti | RK Fēnikss',
  description: 'RK Fēnikss regbija kluba gaidāmās spēles un iepriekšējo spēļu rezultāti.',
  openGraph: {
    title: 'Spēles & Rezultāti | RK Fēnikss',
    description: 'RK Fēnikss regbija kluba gaidāmās spēles un iepriekšējo spēļu rezultāti.',
  },
}

async function getUpcomingFixtures(): Promise<Fixture[]> {
  try {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .gte('match_date', today.toISOString())
      .order('match_date', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching upcoming fixtures:', error)
    return []
  }
}

async function getPastFixtures(): Promise<Fixture[]> {
  try {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .lt('match_date', today.toISOString())
      .order('match_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching past fixtures:', error)
    return []
  }
}

export default async function FixturesPage() {
  const [upcomingFixtures, pastFixtures] = await Promise.all([
    getUpcomingFixtures(),
    getPastFixtures(),
  ])

  return (
    <FixturesClient
      upcomingFixtures={upcomingFixtures}
      pastFixtures={pastFixtures}
    />
  )
}
