import { NextResponse } from 'next/server'
import { createClient } from '../../utils/supabase/server' 

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Se houver um parâmetro 'next', ele redireciona para lá após o login, senão vai para o /home
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se algo der errado, devolve para o login
  return NextResponse.redirect(`${origin}/login?error=true`)
}