STORETAUROS PREMIUM PLUS

Contém:
- Site igual ao modelo roxo/preto enviado.
- Foto construída do site em public/assets/preview-storetauros.png.
- Login e criar conta.
- Modo local funcionando sem banco.
- Supabase preparado para banco real.
- Área Meus pedidos.
- Notificações de compras.
- Painel admin com clientes, vendas, Pix, QR, integração Pix preparada.
- Menu mobile estilo app.
- Produtos com preços:
  100 membros mistos = R$4
  100 membros reais = R$5
  100 membros premium = R$9
  Nitro/Conta = R$6,50
  Designer = R$65
- Discord: https://discord.gg/WPH5Xc58cm

Admin:
senha = admtauros

Para banco real:
1. Crie um projeto Supabase.
2. Rode o arquivo SUPABASE_SETUP.sql no Supabase.
3. No Vercel, adicione as variáveis:
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY

Pix automático real:
O site está preparado no painel admin, mas Pix automático real exige API Mercado Pago/Gerencianet em backend com credenciais.
