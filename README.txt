STORE TAUROS - SITE ANTIGO COM SPOTIFY E SUPABASE

Arquivos necessários no GitHub:
- index.html
- assets/

Configuração Vercel:
- Framework: Other
- Build Command: desligado/vazio
- Install Command: desligado/vazio
- Output Directory: desligado/vazio

Supabase:
No index.html procure:
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

Cole sua URL e sua ANON KEY.

Produtos Spotify:
- Spotify Individual 1 mês: R$20,00
- Spotify Individual 1 ano: R$65,00

Senha admin:
- admtauros
- stadm


QR Codes individuais adicionados em assets/ e ligados aos produtos.

ATUALIZAÇÕES:
- Logo da lateral trocado pela imagem Tauros Store.
- QR Pix principal trocado pelo novo QR enviado.
- Tela de login obrigatória antes de acessar o site.
- Área Fundadores com rendimento total, pessoas cadastradas e vendas.

ALTERAÇÕES FEITAS:
- Senha Fundadores: donotauros
- Senha Painel Admin: admtauros
- Suporte abre direto: https://discord.gg/WPH5Xc58cm
- Criar conta salva no localStorage e tenta salvar na tabela tauros_clients do Supabase.
- SQL atualizado com tauros_clients e tauros_orders.

ATUALIZAÇÃO PAINÉIS:
- Admin agora abre tabela de pedidos, logins, total de vendas e botão puxar compras.
- Fundadores agora abre pedidos, logins, rendimento total e lucro ganho.
- Mensagem 'Supabase não configurado...' removida; agora mostra compras locais sem erro.
- Senha Admin: admtauros
- Senha Fundador: donotauros

ATUALIZAÇÃO RESPONSIVA:
- PC mantém sidebar lateral e layout largo.
- Mobile usa botão ☰, menu lateral recolhível, cards em uma coluna, QR em popup e visual adaptado.
