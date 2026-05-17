export function timeAgo(d: string): string {
  if (!d) return '—'
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return 'agora mesmo'
  if (s < 3600) return Math.floor(s / 60) + 'min atrás'
  if (s < 86400) return Math.floor(s / 3600) + 'h atrás'
  if (s < 604800) return Math.floor(s / 86400) + 'd atrás'
  return new Date(d).toLocaleDateString('pt-BR')
}
export function formatDate(d: string): string {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('pt-BR') } catch { return d }
}
export function formatDateTime(d: string): string {
  if (!d) return '—'
  try { return new Date(d).toLocaleString('pt-BR') } catch { return d }
}
export function hashPass(p: string): string {
  let h = 0
  for (let i = 0; i < p.length; i++) { h = ((h << 5) - h) + p.charCodeAt(i); h |= 0 }
  return 'H' + Math.abs(h).toString(36) + p.length
}
export function checkPass(plain: string, hash: string): boolean {
  return hashPass(plain) === hash
}
