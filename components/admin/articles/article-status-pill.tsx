import { articleState, formatRigaDateTime } from '@/lib/articles'

const styles = {
  draft: 'bg-[#FFF4D6] text-[#8A5A00]',
  scheduled: 'bg-[#E3EEFB] text-[#1F4E8C]',
  published: 'bg-[#E2F3EA] text-[#146C43]',
}

export function ArticleStatusPill({ status, publishedAt }: { status: string | null; publishedAt: string | null }) {
  const state = articleState({ status, published_at: publishedAt })
  const label =
    state === 'draft' ? 'Melnraksts' : state === 'scheduled' ? `Ieplānots · ${formatRigaDateTime(publishedAt!)}` : 'Publicēts'
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[state]}`}>{label}</span>
}
