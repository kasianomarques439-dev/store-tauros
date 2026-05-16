STORE TAUROS - SERVER SYNC REAL

O que foi corrigido:
- Compra só confirma se conseguir enviar para o servidor/Supabase.
- Não mostra mais confirmação local falsa.
- Botão Puxar compras não fica travado; mostra "Atualizando..." e volta.
- Admin busca vendas reais online das últimas 24h.
- Vendas aparecem com cliente, contato, produto, quantidade, total e data.
- Venda é salva em tauros_orders e também como backup em tauros_clients.

Obrigatório:
1. Execute SUPABASE_SQL_DEFINITIVO.txt no Supabase.
2. Publique esta pasta nova na Vercel/GitHub.
3. Teste em outro celular: confirmar compra → admin → puxar compras.

Admin:
Senha: admtauros
