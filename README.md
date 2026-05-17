# Green RP — Staff Panel (Vite + Supabase)

## 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **SQL Editor** e execute o conteúdo de `supabase.sql`
3. Vá em **Settings → API** e copie:
   - **Project URL**
   - **anon public key**

## 2. Configurar o projeto

Crie o arquivo `.env` na raiz:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
```

## 3. Rodar local

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## 4. Publicar no Vercel

1. Suba para o GitHub: `git init && git add . && git commit -m "init" && git push`
2. Importe no [vercel.com](https://vercel.com)
3. Adicione as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
4. Deploy!

## Usuários

| Usuário | Senha      | Permissão |
|---------|------------|-----------|
| bruno   | bruno123   | Admin     |
| souza   | souza123   | Admin     |
| veio    | veio123    | Admin     |
| folha   | folha123   | Admin     |
| leo     | leo123     | Admin     |
| roxy    | roxy123    | Admin     |
| theo    | theo123    | Staff     |

## Webhook (integração loja)

Quando alguém comprar com cupom, envie POST para:
```
https://seu-site.vercel.app/api/cupons/webhook
```
Body:
```json
{
  "cupom": "BRUNO2024",
  "usadoPor": "NomeCliente",
  "valorCompra": 150.00
}
```
