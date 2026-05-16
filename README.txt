STORE TAUROS - VENDAS 24H SYNC CORRIGIDO

Ajustes feitos:
- Ao confirmar compra, aparece apenas: "Compra confirmada!"
- A venda tenta salvar online por 2 métodos: Supabase SDK e REST direto.
- A venda é salva em tauros_orders e também como VENDA_CONFIRMADA em tauros_clients.
- O botão "Puxar compras" agora busca vendas online e locais.
- A aba "Vendas confirmadas" mostra vendas das últimas 24h.
- Admins com senha conseguem ver cliente, produto, quantidade, valor e data.

IMPORTANTE:
Execute o SUPABASE_SQL_DEFINITIVO.txt no Supabase SQL Editor e publique esta pasta nova.
Se o Supabase estiver com URL/KEY errada, vendas de outros aparelhos não vão sincronizar.

Admin:
Senha: admtauros
