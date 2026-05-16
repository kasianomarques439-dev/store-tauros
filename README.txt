STORE TAUROS - VENDAS DEFINITIVO

Correção urgente:
- Ao clicar em confirmar compra, a venda é salva em dois lugares:
  1. tauros_orders
  2. tauros_clients como registro especial VENDA_CONFIRMADA

Isso faz o painel admin conseguir puxar vendas mesmo quando a tabela tauros_orders não mostra.
Como tauros_clients já está funcionando no seu site, os admins conseguem ver as vendas confirmadas com:
- nome do cliente
- email/contato
- produto
- quantidade
- total
- data

IMPORTANTE:
Execute SUPABASE_SQL_DEFINITIVO.txt no Supabase e publique esta pasta nova.

Admin:
Senha: admtauros
