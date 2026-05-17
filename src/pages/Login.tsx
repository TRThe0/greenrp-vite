import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!username || !password) { setError('Preencha usuário e senha.'); return }
    setLoading(true); setError('')
    try {
      await login(username, password, remember)
      navigate('/dashboard')
    } catch (e: any) { setError(e.message || 'Erro ao fazer login') }
    setLoading(false)
  }

  const inp: React.CSSProperties = { width: '100%', background: '#0d1218', border: '1px solid #1e2d3d', borderRadius: 8, padding: '12px 14px', color: '#f0f4f8', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif', marginBottom: 16 }

  return (
    <div style={{ minHeight: '100vh', background: '#080c10', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,230,118,0.07) 0%,transparent 70%)' }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="fade-up">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 68, height: 68, borderRadius: 18, background: 'linear-gradient(135deg,#00e676,#00c853)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800, color: '#080c10', fontFamily: 'Syne,sans-serif', marginBottom: 14, boxShadow: '0 0 40px rgba(0,230,118,0.3)' }}>G</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 700, color: '#f0f4f8' }}>Green RP</div>
          <div style={{ fontSize: 14, color: '#6b7f93', marginTop: 4 }}>Painel</div>
        </div>
        <div style={{ background: '#111820', border: '1px solid #1e2d3d', borderRadius: 16, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          {error && <div style={{ background: 'rgba(255,71,87,0.12)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#ff4757', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>⚠ {error}</div>}
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#a8b8c8', marginBottom: 8 }}>Staff</label>
          <input style={inp} type="text" placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#a8b8c8', marginBottom: 8 }}>Senha</label>
          <div style={{ position: 'relative', marginBottom: 0 }}>
            <input style={{ ...inp, paddingRight: 44, marginBottom: 0 }} type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: '#6b7f93', cursor: 'pointer', fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 24px' }}>
            <input type="checkbox" id="rem" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: '#00e676', width: 16, height: 16, cursor: 'pointer' }} />
            <label htmlFor="rem" style={{ fontSize: 13, color: '#a8b8c8', cursor: 'pointer' }}>Lembrar login</label>
          </div>
          <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: 14, border: 'none', borderRadius: 8, background: 'linear-gradient(135deg,#00e676,#00c853)', color: '#080c10', fontSize: 15, fontWeight: 700, fontFamily: 'Syne,sans-serif', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}>
            {loading ? 'Entrando...' : '➢ Acessar'}
          </button>
        </div>
      </div>
    </div>
  )
}
