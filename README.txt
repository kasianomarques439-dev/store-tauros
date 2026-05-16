STORE TAUROS - CORREÇÃO FAILED TO FETCH

Correção aplicada:
- Criar conta não trava mais em "Failed to fetch".
- Se Supabase falhar, o site entra com fallback local automaticamente.
- Login também tem fallback local.
- Pedido também é salvo localmente se o Supabase falhar.
- Painel admin puxa compras do Supabase e também dados locais.

IMPORTANTE:
Para as compras aparecerem entre dispositivos diferentes, o Supabase precisa aceitar conexão.
Execute o arquivo SUPABASE_SQL_DEFINITIVO.txt no SQL Editor e publique novamente.

Se ainda aparecer modo local:
1. Confira se a URL e KEY do Supabase em src/config.js estão corretas.
2. Confira se o projeto Supabase não está pausado.
3. Confira se o SQL foi executado com sucesso.

Admin:
Senha: admtauros
