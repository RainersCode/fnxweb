'use client'

import { useState } from 'react'
import { ChevronsUpDown, Pencil, Plus } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { TeamDialog, type TeamRow } from './team-dialog'

function Logo({ url }: { url: string | null }) {
  // eslint-disable-next-line @next/next/no-img-element
  return url ? <img src={url} alt="" className="h-7 w-7 shrink-0 object-contain" /> : <span className="h-7 w-7 shrink-0 rounded bg-club-pale" />
}

export function TeamPicker({ teams, value, fallbackName, onChange, onTeamsChange }: {
  teams: TeamRow[]
  value: TeamRow | null
  fallbackName?: string
  onChange: (team: TeamRow) => void
  onTeamsChange: (teams: TeamRow[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [dialog, setDialog] = useState<{ team: TeamRow | null; name?: string } | null>(null)

  const saved = (team: TeamRow) => {
    const exists = teams.some((t) => t.id === team.id)
    onTeamsChange(exists ? teams.map((t) => (t.id === team.id ? team : t)) : [...teams, team].sort((a, b) => a.name.localeCompare(b.name, 'lv')))
    onChange(team)
  }

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger type="button" className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-[#DCE3DF] bg-white px-3 py-2 text-left">
          {value ? <Logo url={value.logo_url} /> : null}
          <span className={`min-w-0 flex-1 truncate ${value || fallbackName ? '' : 'text-[#5B6863]'}`}>{value?.name ?? fallbackName ?? 'Izvēlies pretinieku'}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#5B6863]" />
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[260px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Meklēt komandu…" value={query} onValueChange={setQuery} />
            <CommandList>
              <CommandEmpty>Nav atrasts</CommandEmpty>
              <CommandGroup>
                {teams.map((t) => (
                  <CommandItem key={t.id} value={t.name} onSelect={() => { onChange(t); setOpen(false) }} className="gap-3">
                    <Logo url={t.logo_url} /> {t.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandItem value={`__new__${query}`} onSelect={() => { setOpen(false); setDialog({ team: null, name: query }) }} className="gap-2 font-semibold text-club">
                  <Plus className="h-4 w-4" /> Jauna komanda{query ? `: ${query}` : ''}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <button type="button" aria-label="Labot komandu" onClick={() => setDialog({ team: value })} className="rounded-md border border-[#DCE3DF] px-3 text-[#5B6863] hover:text-club">
          <Pencil className="h-4 w-4" />
        </button>
      )}
      <TeamDialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)} team={dialog?.team} initialName={dialog?.name} onSaved={saved} />
    </div>
  )
}
