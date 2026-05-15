STORE TAUROS - FIX PIX + ONLINE

ALTERADO:
- Pix agora tem chave fixa no código para todos os clientes.
- Tela principal mostra quantos online no site.
- Painel Admin ganhou:
  - Puxar compras
  - Baixar vendas em CSV
  - Limpar vendas
  - Abrir Discord

IMPORTANTE SOBRE PIX:
O erro acontecia porque localStorage salva apenas no navegador do admin, não no navegador dos clientes.
Para resolver de verdade, coloque sua chave Pix no arquivo:
src/config.js

Troque:
COLOQUE-SUA-CHAVE-PIX-AQUI
pela sua chave real.

Depois faça push/deploy novamente na Vercel.

COMANDOS:
npm install
npm run dev

VERCEL:
Framework: Vite
Build command: npm run build
Output directory: dist
