import { NextRequest, NextResponse } from 'next/server'
import type { z } from 'zod'
import { isAdminRequest } from './admin-auth'
import { createAdminClient } from './supabase'
import { removeMediaFiles } from './storage'
import { fieldErrors } from './admin-schemas'

export type CrudOptions = {
  table: string
  schema: z.ZodTypeAny
  order: Array<{ column: string; ascending?: boolean; nullsFirst?: boolean }>
  imageField?: string
  label: string // Latvian noun for messages, e.g. "spēlētāju"
}

type Ctx = { params: { id: string } }

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

async function parse(req: NextRequest, schema: z.ZodTypeAny) {
  const result = schema.safeParse(await req.json().catch(() => null))
  if (!result.success) {
    return { error: NextResponse.json({ error: 'Pārbaudi laukus', fields: fieldErrors(result.error) }, { status: 400 }) }
  }
  return { data: result.data as Record<string, unknown> }
}

// GET list + POST create for one table
export function listAndCreate(opts: CrudOptions) {
  return {
    GET: async () => {
      if (!(await isAdminRequest())) return unauthorized()
      let query = createAdminClient().from(opts.table).select('*')
      for (const o of opts.order) query = query.order(o.column, { ascending: o.ascending ?? true, nullsFirst: o.nullsFirst })
      const { data, error } = await query
      if (error) {
        console.error(`List ${opts.table}:`, error)
        return NextResponse.json({ error: 'Neizdevās ielādēt' }, { status: 500 })
      }
      return NextResponse.json(data)
    },
    POST: async (req: NextRequest) => {
      if (!(await isAdminRequest())) return unauthorized()
      const parsed = await parse(req, opts.schema)
      if (parsed.error) return parsed.error
      const { data, error } = await createAdminClient().from(opts.table).insert(parsed.data).select('*').single()
      if (error) {
        console.error(`Create ${opts.table}:`, error)
        return NextResponse.json({ error: `Neizdevās saglabāt ${opts.label}` }, { status: 500 })
      }
      return NextResponse.json(data)
    },
  }
}

// GET / PATCH / DELETE one row; replaced or removed photos are deleted after the database change
export function itemRoutes(opts: CrudOptions) {
  const load = (id: string) => createAdminClient().from(opts.table).select('*').eq('id', id).maybeSingle()
  return {
    GET: async (_req: NextRequest, { params }: Ctx) => {
      if (!(await isAdminRequest())) return unauthorized()
      const { data, error } = await load(params.id)
      if (error) return NextResponse.json({ error: 'Neizdevās ielādēt' }, { status: 500 })
      return data ? NextResponse.json(data) : NextResponse.json({ error: 'Nav atrasts' }, { status: 404 })
    },
    PATCH: async (req: NextRequest, { params }: Ctx) => {
      if (!(await isAdminRequest())) return unauthorized()
      const parsed = await parse(req, opts.schema)
      if (parsed.error) return parsed.error
      const { data: current } = await load(params.id)
      if (!current) return NextResponse.json({ error: 'Nav atrasts' }, { status: 404 })
      const { data, error } = await createAdminClient().from(opts.table).update(parsed.data).eq('id', params.id).select('*').single()
      if (error) {
        console.error(`Update ${opts.table}:`, error)
        return NextResponse.json({ error: `Neizdevās saglabāt ${opts.label}` }, { status: 500 })
      }
      if (opts.imageField) {
        const before = (current as Record<string, unknown>)[opts.imageField] as string | null
        const after = (data as Record<string, unknown>)[opts.imageField] as string | null
        if (before && before !== after) await removeMediaFiles([before])
      }
      return NextResponse.json(data)
    },
    DELETE: async (_req: NextRequest, { params }: Ctx) => {
      if (!(await isAdminRequest())) return unauthorized()
      const { data: current } = await load(params.id)
      const { error } = await createAdminClient().from(opts.table).delete().eq('id', params.id)
      if (error) {
        console.error(`Delete ${opts.table}:`, error)
        return NextResponse.json({ error: `Neizdevās dzēst ${opts.label}` }, { status: 500 })
      }
      if (opts.imageField && current) await removeMediaFiles([(current as Record<string, unknown>)[opts.imageField] as string | null])
      return NextResponse.json({ success: true })
    },
  }
}
