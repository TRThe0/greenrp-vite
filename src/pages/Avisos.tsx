import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { supabase } from '../lib/supabase'
import { timeAgo } from '../lib/utils'
import { getSession } from '../lib/auth'

export default function Avisos() {
  const [avisos, setAvisos] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ tipo: 'info', msg: '' })
  const session = getSession()
  const isAdmin = session?.perm === 'admin'
  const inp: any = { width: '100%', background: '#111820', border: '1px solid #1e2d3d', borderRadius: 8, padding: '10px 14px', color: '#f0f4f8', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif' }

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('avisos').select('*').order('created_at', { ascending: false })
    setAvisos(data || [])
  }

  async function save() {
    if (!form.msg.trim()) return alert('Escreva a mensagem do aviso.')
    await supabase.from('avisos').insert({ tipo: form.tipo, msg: form.msg, autor: session?.nome || 'Admin' })
    await supabase.from('logs').insert({ type: 'aviso', icon: 'Bell', color: 'amber', msg: `<strong>${session?.nome}</strong> publicou um aviso interno` })
    setModal(false)
    setForm({ tipo: 'info', msg: '' })
    load()
  }

  async function remove(id: number) {
    await supabase.from('avisos').delete().eq('id', id)
    load()
  }

  const bc = (t: string) => t === 'danger' ? '#ff4757' : t === 'warn' ? '#ffa502' : '#00e676'

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 700, color: '#f0f4f8' }}>Avisos Internos</div>
          <div style={{ fontSize: 13, color: '#6b7f93', marginTop: 2 }}>Comunicados para a equipe</div>
        </div>
        {isAdmin && <button onClick={() => setModal(true)} style={{ padding: '9px 18px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg,#00e676,#00c853)', color: '#080c10', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Novo Aviso</button>}
      </div>

      {!avisos.length && <div style={{ textAlign: 'center', padding: 60, color: '#6b7f93', fontSize: 14 }}>Nenhum aviso publicado</div>}

      {avisos.map((a, i) => (
        <div key={i} style={{ background: '#111820', border: '1px solid #1e2d3d', borderLeft: `3px solid ${bc(a.tipo)}`, borderRadius: 12, padding: '16px 20px', marginBottom: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, color: bc(a.tipo), background: bc(a.tipo) + '18', border: `1px solid ${bc(a.tipo)}33`, marginBottom: 10 }}>
              {a.tipo === 'danger' ? '🚨 Urgente' : a.tipo === 'warn' ? '⚠️ Atenção' : 'ℹ️ Informativo'}
            </span>
            <div style={{ fontSize: 14, color: '#a8b8c8', lineHeight: 1.7, marginBottom: 8 }}>{a.msg}</div>
            <div style={{ fontSize: 11, color: '#6b7f93' }}>Por <strong style={{ color: '#a8b8c8' }}>{a.autor}</strong> · {timeAgo(a.created_at)}</div>
          </div>
          {isAdmin && (
            <button onClick={() => remove(a.id)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', color: '#ff4757', cursor: 'pointer', flexShrink: 0, fontSize: 13 }}>🗑</button>
          )}
        </div>
      ))}

      <Modal open={modal} title="Novo Aviso" onClose={() => setModal(false)} onConfirm={save} confirmLabel="Publicar">
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: '#6b7f93', display: 'block', marginBottom: 6 }}>Tipo</label>
            <select style={inp} value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
              <option value="info">Informativo</option>
              <option value="warn">Atenção</option>
              <option value="danger">Urgente</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#6b7f93', display: 'block', marginBottom: 6 }}>Mensagem</label>
            <textarea style={{ ...inp, resize: 'vertical' }} rows={4} placeholder="Escreva o aviso..." value={form.msg} onChange={e => setForm(f => ({ ...f, msg: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
