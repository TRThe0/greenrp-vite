import { ReactNode } from 'react'

interface Props {
  open: boolean; title: string; children: ReactNode
  onClose: () => void; onConfirm: () => void
  confirmLabel?: string; danger?: boolean
}

export default function Modal({ open, title, children, onClose, onConfirm, confirmLabel = 'Confirmar', danger = false }: Props) {
  if (!open) return null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} className="scale-in" style={{ background: '#0d1218', border: '1px solid #243447', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #1e2d3d' }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 700, color: '#f0f4f8' }}>{title}</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#161f2a', border: '1px solid #1e2d3d', color: '#6b7f93', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
        <div style={{ padding: '14px 24px', borderTop: '1px solid #1e2d3d', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ padding: '9px 18px', border: '1px solid #1e2d3d', borderRadius: 8, background: '#161f2a', color: '#a8b8c8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
          <button onClick={onConfirm} style={{ padding: '9px 18px', borderRadius: 8, border: danger ? '1px solid rgba(255,71,87,0.3)' : 'none', background: danger ? 'rgba(255,71,87,0.15)' : 'linear-gradient(135deg,#00e676,#00c853)', color: danger ? '#ff4757' : '#080c10', fontSize: 13, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
