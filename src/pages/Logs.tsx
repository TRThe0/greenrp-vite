import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { formatDateTime } from '../lib/utils'
import { getSession } from '../lib/auth'

const COLOR: Record<string, string> = { blue: '#4facfe', green: '#00e676', red: '#ff4757', amber: '#ffa502', purple: '#b388ff' }
const BG: Record<string, string> = { blue: 'rgba(79,172,254,0.12)', green: 'rgba(0,230,118,0.12)', red: 'rgba(255,71,87,0.12)', amber: 'rgba(255,165,2,0.12)', purple: 'rgba(179,136,255,0.12)' }

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const session = getSession()

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(500)
    setLogs(data || [])
  }

  async function clear() {
    if (!confirm('Limpar todos os logs?')) return
    await supabase.from('logs').delete().neq('id', 0)
    load()
  }

  const filtered = logs.filter(l => {
    const q = search.toLowerCase()
    return (!q || l.msg.replace(/<[^>]+>/g, '').toLowerCase().includes(q)) && (!type || l.type === type)
  })

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 700, color: '#f0f4f8' }}>Logs do Sistema</div>
          <div style={{ fontSize: 13, color: '#6b7f93', marginTop: 2 }}>Histórico completo de alterações</div>
        </div>
        {session?.perm === 'admin' && (
          <button onClick={clear} style={{ padding: '9px 16px', border: '1px solid #1e2d3d', borderRadius: 8, background: '#161f2a', color: '#a8b8c8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🗑 Limpar</button>
        )}
      </div>

      <div style={{ background: '#111820', border: '1px solid #1e2d3d', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 10, padding: '14px 18px', borderBottom: '1px solid #1e2d3d', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#161f2a', border: '1px solid #1e2d3d', borderRadius: 8, padding: '8px 12px', flex: 1, minWidth: 180 }}>
            <span style={{ color: '#6b7f93' }}>🔍</span>
            <input type="text" placeholder="Buscar nos logs..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: '#f0f4f8', fontSize: 13, width: '100%', fontFamily: 'DM Sans,sans-serif' }} />
          </div>
          <select value={type} onChange={e => setType(e.target.value)} style={{ background: '#161f2a', border: '1px solid #1e2d3d', borderRadius: 8, padding: '8px 12px', color: '#a8b8c8', fontSize: 13, outline: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>
            <option value="">Todos os tipos</option>
            <option value="login">Login</option>
            <option value="add">Adição</option>
            <option value="edit">Edição</option>
            <option value="remove">Remoção</option>
            <option value="promo">Promoção</option>
            <option value="aviso">Aviso</option>
            <option value="cupom">Cupom</option>
            <option value="reset">Reset</option>
          </select>
        </div>
        {!filtered.length && <div style={{ textAlign: 'center', padding: 50, color: '#6b7f93', fontSize: 14 }}>Nenhum log encontrado</div>}
        {filtered.map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 20px', borderBottom: '1px solid #1e2d3d' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: BG[l.color] || BG.blue, color: COLOR[l.color] || COLOR.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, marginTop: 1 }}>●</div>
            <div>
              <div style={{ fontSize: 13, color: '#a8b8c8' }} dangerouslySetInnerHTML={{ __html: l.msg }} />
              <div style={{ fontSize: 11, color: '#6b7f93', marginTop: 3 }}>{formatDateTime(l.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
