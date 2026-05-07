import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const listType = searchParams.get('listType')

  if (!listType || !['general', 'now'].includes(listType)) {
    return NextResponse.json({ error: 'Invalid listType' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tobuy')
    .select('*')
    .eq('list_type', listType)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { text, listType } = body

  if (!text || !listType || !['general', 'now'].includes(listType)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tobuy')
    .insert([{ text, list_type: listType, completed: false }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0], { status: 201 })
}
