import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { timeAgo } from '../lib/utils'
import { getSession } from '../lib/auth'

export default function Cupons() {
  const [staffs, setStaffs] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [resetting, setResetting] = useState(false)
  const [copied, setCopied] = useState(false)
  const session = getSession()
  const isAdmin = session?.perm === 'admin'

  useEffect(() => { load() }, [])

  async function load() {
    const [s, c] = await Promise.all([
      supabase.from('staffs').select('*').order('valor_gerado', { ascending: false }),
      supabase.from('cupons').select('*').order('created_at', { ascending: false }),
    ])
    setStaffs(s.data || [])
    setHistory(c.data || [])
  }

  async function resetar() {
    if (!confirm('Resetar TODOS os valores de cupons? Esta ação não pode ser desfeita.')) return
    setResetting(true)
    await supabase.from('cupons').delete().neq('id', 0)
    await supabase.from('staffs').update({ usos: 0, valor_gerado: 0, comissao_total: 0 }).neq('id', 0)
    await supabase.from('logs').insert({ type: 'reset', icon: 'RefreshCw', color: 'red', msg: `<strong>${session?.nome}</strong> resetou todos os valores de cupons do mês` })
    await load()
    setResetting(false)
  }

  function copyWebhook() {
    const url = `${window.location.origin}/api/cupons/webhook`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maxVal = staffs[0]?.valor_gerado || 1
  const totalUsos = staffs.reduce((a, s) => a + (s.usos || 0), 0)
  const totalGerado = staffs.reduce((a, s) => a + (Number(s.valor_gerado) || 0), 0)
  const totalComissao = staffs.reduce((a, s) => a + (Number(s.comissao_total) || 0), 0)

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 700, color: '#f0f4f8' }}>Gerenciamento de Cupons</div>
          <div style={{ fontSize: 13, color: '#6b7f93', marginTop: 2 }}>Ranking e histórico mensal</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={copyWebhook} style={{ padding: '9px 16px', border: '1px solid rgba(79,172,254,0.3)', borderRadius: 8, background: 'rgba(79,172,254,0.1)', color: '#4facfe', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {copied ? '✅ Copiado!' : '🔗 URL do Webhook'}
          </button>
          {isAdmin && (
            <button onClick={resetar} disabled={resetting} style={{ padding: '9px 16px', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 8, background: 'rgba(255,71,87,0.1)', color: '#ff4757', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: resetting ? 0.6 : 1 }}>
              🔄 {resetting ? 'Resetando...' : 'Resetar Mês'}
            </button>
          )}
        </div>
      </div>

      {/* RESUMO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total de Usos', val: totalUsos, color: '#4facfe', icon: '🎫' },
          { label: 'Total em Vendas', val: `R$ ${totalGerado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: '#00e676', icon: '💰' },
          { label: 'Total em Comissões', val: `R$ ${totalComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: '#ffa502', icon: '🏆' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#111820', border: '1px solid #1e2d3d', borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: '#6b7f93', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginBottom: 28 }}>
        {staffs.map(s => {
          const comissao = Number(s.comissao_total) || 0
          const pct = Math.round((Number(s.valor_gerado) / maxVal) * 100)
          return (
            <div key={s.id} style={{ background: '#111820', border: '1px solid #1e2d3d', borderRadius: 12, padding: 20, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#243447'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e2d3d'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 700, color: '#00e676', letterSpacing: 1 }}>{s.cupom}</div>
                  <div style={{ fontSize: 13, color: '#a8b8c8', marginTop: 2 }}>{s.nome} · {s.cargo}</div>
                </div>
                <span style={{ background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.2)', padding: '4px 10px', borderRadius: 99, fontSize: 13, fontWeight: 700, color: '#00e676' }}>{s.pct}%</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                <div style={{ background: '#161f2a', borderRadius: 8, padding: '10px 10px' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f4f8', fontFamily: 'Syne,sans-serif' }}>{s.usos}</div>
                  <div style={{ fontSize: 10, color: '#6b7f93', marginTop: 2 }}>Usos</div>
                </div>
                <div style={{ background: '#161f2a', borderRadius: 8, padding: '10px 10px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#4facfe', fontFamily: 'Syne,sans-serif' }}>R$ {Number(s.valor_gerado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div style={{ fontSize: 10, color: '#6b7f93', marginTop: 2 }}>Vendas</div>
                </div>
                <div style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)', borderRadius: 8, padding: '10px 10px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00e676', fontFamily: 'Syne,sans-serif' }}>R$ {comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div style={{ fontSize: 10, color: '#6b7f93', marginTop: 2 }}>Comissão</div>
                </div>
              </div>
              <div style={{ height: 3, background: '#1a2535', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(90deg,#00e676,#69f0ae)', borderRadius: 99, transition: 'width 0.8s ease' }}></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* HISTÓRICO */}
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 14, color: '#f0f4f8' }}>Histórico de Utilização</div>
      <div style={{ background: '#111820', border: '1px solid #1e2d3d', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#161f2a' }}>
              {['Cupom', 'Staff', 'Comprador', 'Valor da Compra', 'Comissão do Staff', 'Data'].map(h => (
                <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6b7f93', letterSpacing: '0.8px', textTransform: 'uppercase', borderBottom: '1px solid #1e2d3d', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!history.length && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#6b7f93', fontSize: 13 }}>Nenhum uso registrado este mês</td></tr>}
              {history.map((h, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1e2d3d' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#161f2a')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '13px 18px' }}><span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#ffa502' }}>{h.cupom}</span></td>
                  <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 600, color: '#f0f4f8' }}>{h.staff_nome}</td>
                  <td style={{ padding: '13px 18px', fontSize: 13, color: '#a8b8c8' }}>{h.usado_por}</td>
                  <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 600, color: '#4facfe' }}>R$ {Number(h.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#00e676', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 6, padding: '3px 10px' }}>
                      R$ {Number(h.comissao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td style={{ padding: '13px 18px', fontSize: 13, color: '#6b7f93' }}>{timeAgo(h.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
