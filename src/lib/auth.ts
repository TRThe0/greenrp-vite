import { supabase } from './supabase'
import { checkPass } from './utils'

export interface Session { userId: number; perm: string; nome: string; exp: number }

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem('grp_session') || sessionStorage.getItem('grp_session')
    if (!raw) return null
    const obj = JSON.parse(raw)
    if (obj.exp > Date.now()) return obj
  } catch {}
  return null
}

export async function login(username: string, password: string, remember: boolean) {
  const { data, error } = await supabase.from('staffs').select('*').ilike('username', username).single()
  if (error || !data) throw new Error('Usuário ou senha inválidos')
  if (!checkPass(password, data.senha)) throw new Error('Usuário ou senha inválidos')
  await supabase.from('staffs').update({ online: true, ultimo_acesso: new Date().toISOString() }).eq('id', data.id)
  await supabase.from('logs').insert({ type: 'login', icon: 'LogIn', color: 'blue', msg: `<strong>${data.nome}</strong> entrou no painel` })
  const session: Session = { userId: data.id, perm: data.perm, nome: data.nome, exp: Date.now() + 3600000 * 8 }
  ;(remember ? localStorage : sessionStorage).setItem('grp_session', JSON.stringify(session))
  localStorage.setItem('grp_user', JSON.stringify({ ...data, senha: undefined }))
  return data
}

export async function logout() {
  const session = getSession()
  if (session) {
    await supabase.from('staffs').update({ online: false }).eq('id', session.userId)
    await supabase.from('logs').insert({ type: 'login', icon: 'LogOut', color: 'red', msg: `<strong>${session.nome}</strong> saiu do painel` })
  }
  localStorage.removeItem('grp_session')
  localStorage.removeItem('grp_user')
  sessionStorage.removeItem('grp_session')
}
