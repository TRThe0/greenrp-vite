-- ══════════════════════════════════════════════
-- GREEN RP STAFF PANEL — SQL SUPABASE
-- Cole isso no SQL Editor do Supabase e execute
-- ══════════════════════════════════════════════

-- ── STAFFS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS staffs (
  id            SERIAL PRIMARY KEY,
  nome          TEXT NOT NULL,
  username      TEXT NOT NULL UNIQUE,
  senha         TEXT NOT NULL,
  cargo         TEXT NOT NULL DEFAULT 'Staff',
  setor         TEXT[] NOT NULL DEFAULT '{"Suporte"}',
  carga         INTEGER NOT NULL DEFAULT 20,
  perm          TEXT NOT NULL DEFAULT 'staff' CHECK (perm IN ('staff','admin')),
  cupom         TEXT NOT NULL UNIQUE,
  pct           INTEGER NOT NULL DEFAULT 10,
  online        BOOLEAN NOT NULL DEFAULT false,
  foto          TEXT DEFAULT '',
  id_rp         INTEGER DEFAULT NULL,
  entrada       DATE NOT NULL DEFAULT CURRENT_DATE,
  ultima_promo  DATE NOT NULL DEFAULT CURRENT_DATE,
  ultimo_acesso TIMESTAMPTZ DEFAULT NULL,
  usos          INTEGER NOT NULL DEFAULT 0,
  valor_gerado  NUMERIC(10,2) NOT NULL DEFAULT 0,
  comissao_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── CUPONS (histórico de uso) ─────────────────
CREATE TABLE IF NOT EXISTS cupons (
  id          SERIAL PRIMARY KEY,
  cupom       TEXT NOT NULL,
  staff_nome  TEXT NOT NULL,
  staff_id    INTEGER REFERENCES staffs(id) ON DELETE SET NULL,
  usado_por   TEXT NOT NULL DEFAULT 'Anônimo',
  valor       NUMERIC(10,2) NOT NULL,
  comissao    NUMERIC(10,2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── AVISOS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS avisos (
  id         SERIAL PRIMARY KEY,
  tipo       TEXT NOT NULL DEFAULT 'info' CHECK (tipo IN ('info','warn','danger')),
  msg        TEXT NOT NULL,
  autor      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── LOGS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS logs (
  id         SERIAL PRIMARY KEY,
  type       TEXT NOT NULL,
  icon       TEXT NOT NULL DEFAULT 'Info',
  color      TEXT NOT NULL DEFAULT 'blue',
  msg        TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── PROMOÇÕES (histórico) ─────────────────────
CREATE TABLE IF NOT EXISTS promovidos (
  id         SERIAL PRIMARY KEY,
  staff_id   INTEGER REFERENCES staffs(id) ON DELETE CASCADE,
  nome       TEXT NOT NULL,
  de_cargo   TEXT NOT NULL,
  para_cargo TEXT NOT NULL,
  feito_por  TEXT NOT NULL DEFAULT 'Sistema',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════════════
-- DESABILITAR RLS (Row Level Security)
-- Para uso interno sem autenticação do Supabase
-- ══════════════════════════════════════════════
ALTER TABLE staffs DISABLE ROW LEVEL SECURITY;
ALTER TABLE cupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE avisos DISABLE ROW LEVEL SECURITY;
ALTER TABLE logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE promovidos DISABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════
-- SEED — Usuários iniciais
-- ══════════════════════════════════════════════
INSERT INTO staffs (nome, username, senha, cargo, setor, carga, perm, cupom, pct, entrada, ultima_promo) VALUES
('Bruno', 'bruno', 'H91ydho8', 'CEO',            '{"Administração"}', 30, 'admin', 'BRUNO2024', 15, '2025-09-12', '2026-03-12'),
('Souza', 'souza', 'Ht01ub68', 'Administrador',  '{"Administração"}', 25, 'admin', 'SOUZA10',   10, '2025-10-12', '2026-02-12'),
('Veio',  'veio',  'H5oaa657', 'Administrador',  '{"Administração"}', 20, 'admin', 'VEIO15',    15, '2025-11-12', '2026-01-12'),
('Folha', 'folha', 'H4x725y8', 'Diretor',        '{"Administração"}', 22, 'admin', 'FOLHA20',   20, '2025-12-12', '2026-04-12'),
('Leo',   'leo',   'Hiapqck6', 'Administrador',  '{"Administração"}', 18, 'admin', 'LEO10',     10, '2026-01-12', '2026-03-12'),
('Roxy',  'roxy',  'Hmyopys7', 'Administrador',  '{"Administração"}', 20, 'admin', 'ROXY10',    10, '2026-02-12', '2026-04-12'),
('Theo',  'theo',  'Hmbklgs7', 'Moderador',      '{"Suporte"}',       15, 'staff', 'THEO5',      5, '2026-03-12', '2026-04-12')
ON CONFLICT (username) DO NOTHING;

INSERT INTO avisos (tipo, msg, autor) VALUES
('info', 'Bem-vindos ao novo painel de gerenciamento da staff! Qualquer dúvida, acione um administrador.', 'Sistema'),
('warn', 'Lembrete: relatório de atividades do mês deve ser enviado até o dia 30.', 'Bruno')
ON CONFLICT DO NOTHING;

INSERT INTO logs (type, icon, color, msg) VALUES
('login', 'LogIn', 'blue', '<strong>Sistema</strong> inicializado com sucesso')
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════
-- FUNÇÃO: Reset mensal de cupons
-- ══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION reset_cupons_mes()
RETURNS void AS $$
BEGIN
  DELETE FROM cupons;
  UPDATE staffs SET usos = 0, valor_gerado = 0, comissao_total = 0;
END;
$$ LANGUAGE plpgsql;

-- ══════════════════════════════════════════════
-- ÍNDICES para melhor performance
-- ══════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_staffs_username ON staffs(username);
CREATE INDEX IF NOT EXISTS idx_staffs_cupom ON staffs(cupom);
CREATE INDEX IF NOT EXISTS idx_cupons_cupom ON cupons(cupom);
CREATE INDEX IF NOT EXISTS idx_logs_created ON logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_promovidos_staff ON promovidos(staff_id);

-- ══════════════════════════════════════════════
-- SENHAS (para referência):
-- bruno  → bruno123
-- souza  → souza123
-- veio   → veio123
-- folha  → folha123
-- leo    → leo123
-- roxy   → roxy123
-- theo   → theo123
-- ══════════════════════════════════════════════
