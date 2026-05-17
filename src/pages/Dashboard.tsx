import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { timeAgo } from '../lib/utils'

export default function Dashboard() {
  const [staffs, setStaffs] = useState<any[]>([])
  const [cupons, setCupons] = useState<any[]>([])
  const [promovidos, setPromovidos] = useState<any[]>([])
  const [avisos, setAvisos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('staffs').select('*').order('id'),
      supabase.from('cupons').select('*').order('created_at', { ascending: false }),
      supabase.from('promovidos').select('*').order('created_at', { ascending: false }),
      supabase.from('avisos').select('*').order('created_at', { ascending: false }).limit(3),
    ]).then(([s, c, p, a]) => {
      setStaffs(s.data || [])
      setCupons(c.data || [])
      setPromovidos(p.data || [])
      setAvisos(a.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const sorted = [...staffs].sort((a, b) => b.usos - a.usos)
  const maxUsos = sorted[0]?.usos || 1
  const card: React.CSSProperties = { background: '#111820', border: '1px solid #1e2d3d', borderRadius: 12, padding: 20 }

  if (loading) return <Layout><div style={{ textAlign: 'center', padding: 60, color: '#6b7f93' }}>Carregando...</div></Layout>

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total de Staffs', val: staffs.length, color: '#00e676', icon: '👥' },
          { label: 'Staffs Online', val: staffs.filter(s => s.online).length, color: '#4facfe', icon: '🟢' },
          { label: 'Cupons Usados', val: cupons.length, color: '#ffa502', icon: '🎫' },
          { label: 'Promovidos', val: promovidos.length, color: '#b388ff', icon: '⬆️' },
        ].map((s, i) => (
          <div key={i} style={card} className="fade-up">
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 13, color: '#6b7f93', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={card}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#f0f4f8' }}>🔥 Staffs Mais Ativos</div>
          {sorted.slice(0, 5).map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 4 ? '1px solid #1e2d3d' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? 'rgba(255,165,2,0.15)' : '#1a2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i === 0 ? '#ffa502' : '#6b7f93', flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f4f8' }}>{s.nome} <span style={{ fontSize: 11, color: '#6b7f93' }}>{s.cargo}</span></div>
                <div style={{ fontSize: 12, color: '#6b7f93' }}>{s.usos} usos · R$ {(s.valor_gerado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div style={{ height: 3, background: '#1a2535', borderRadius: 99, marginTop: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: Math.round((s.usos / maxUsos) * 100) + '%', background: 'linear-gradient(90deg,#00e676,#69f0ae)', borderRadius: 99 }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#f0f4f8' }}>⬆️ Últimos Promovidos</div>
          {!promovidos.length && <div style={{ textAlign: 'center', padding: 30, color: '#6b7f93', fontSize: 13 }}>Nenhuma promoção</div>}
          {promovidos.slice(0, 4).map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid #1e2d3d' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#00e676', flexShrink: 0 }}>{p.nome.charAt(0)}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f4f8' }}>{p.nome}</div>
                <div style={{ fontSize: 12, color: '#6b7f93' }}>{p.de_cargo} → <span style={{ color: '#00e676' }}>{p.para_cargo}</span></div>
                <div style={{ fontSize: 11, color: '#6b7f93' }}>{timeAgo(p.created_at)}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#f0f4f8' }}>📢 Avisos Internos</div>
          {!avisos.length && <div style={{ textAlign: 'center', padding: 30, color: '#6b7f93', fontSize: 13 }}>Nenhum aviso</div>}
          {avisos.map((a, i) => (
            <div key={i} style={{ background: '#161f2a', border: '1px solid #1e2d3d', borderLeft: `3px solid ${a.tipo === 'danger' ? '#ff4757' : a.tipo === 'warn' ? '#ffa502' : '#00e676'}`, borderRadius: 8, padding: '12px 14px', marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: '#a8b8c8' }}>{a.msg}</div>
              <div style={{ fontSize: 11, color: '#6b7f93', marginTop: 4 }}>Por {a.autor} · {timeAgo(a.created_at)}</div>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#f0f4f8' }}>🕐 Últimos Acessos</div>
          {[...staffs].filter(s => s.ultimo_acesso).sort((a, b) => new Date(b.ultimo_acesso).getTime() - new Date(a.ultimo_acesso).getTime()).slice(0, 6).map((s, i, arr) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid #1e2d3d' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: '#1a2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#00e676', flexShrink: 0 }}>{s.nome.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f4f8' }}>{s.nome}</div>
                <div style={{ fontSize: 11, color: '#6b7f93' }}>{timeAgo(s.ultimo_acesso)}</div>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.online ? '#00e676' : '#6b7f93' }}></div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
