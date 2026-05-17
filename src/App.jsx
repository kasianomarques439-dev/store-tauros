import { useMemo, useState } from 'react'

const PIX_KEY = 'taurosorg@gmail.com'
const ADM_PASSWORD = 'stadm'
const SUPPORT_PASSWORD = 'sptauros'

const categories = [
  { id: 'membros', name: 'Membros Discord' },
  { id: 'contas', name: 'Contas Nitradas' },
  { id: 'nitro', name: 'Nitro Link' },
  { id: 'impulsos', name: 'Impulsos' },
  { id: 'spotify', name: 'Spotify' },
  { id: 'design', name: 'Design' }
]

const products = [
  { category: 'membros', name: 'Membros Online', description: '100 membros online para servidor Discord', price: 10.00, image: '/assets/membros.png' },
  { category: 'membros', name: 'Membros Reais', description: '100 membros reais para servidor Discord', price: 3.80, image: '/assets/membros.png' },
  { category: 'membros', name: 'Membros Premium', description: '100 membros premium para servidor Discord', price: 6.50, image: '/assets/membros.png' },

  { category: 'contas', name: 'Conta Nitrada 1 Mês', description: 'Conta Discord nitrada com entrega digital', price: 6.00, image: '/assets/nitrada.png' },
  

  { category: 'nitro', name: 'Nitro Link 1 Mês', description: 'Link de Nitro para ativar na sua conta', price: 1.99, image: '/assets/nitrolink.png' },
  
  { category: 'nitro', name: 'Ativação Link', description: 'Ativação segura do Nitro Link na sua conta', price: 2.00, image: '/assets/nitrolink.png' },

  { category: 'impulsos', name: 'Impulsos 2x', description: '2 impulsos para seu servidor Discord', price: 3.50, image: '/assets/impulsos.png' },
  { category: 'impulsos', name: 'Impulsos 4x', description: '4 impulsos para seu servidor Discord', price: 7.00, image: '/assets/impulsos.png' },
  { category: 'impulsos', name: 'Impulsos 8x', description: '8 impulsos para seu servidor Discord', price: 10.50, image: '/assets/impulsos.png' },
  { category: 'impulsos', name: 'Impulsos 14x', description: '14 impulsos para seu servidor Discord', price: 21.99, image: '/assets/impulsos.png' },

  { category: 'spotify', name: 'Spotify Premium 1 Mês', description: 'Spotify Premium mensal', price: 8.00, image: '/assets/spotify.png' },
  

  { category: 'design', name: 'Design de Servidor', description: 'Organização, cargos, canais e visual completo do servidor', price: 50.00, image: '/assets/design.png' }
]

function currency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem('store_tauros_orders') || '[]')
  } catch {
    return []
  }
}

function saveOrders(list) {
  localStorage.setItem('store_tauros_orders', JSON.stringify(list))
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState('membros')
  const [orders, setOrders] = useState(loadOrders)
  const [panel, setPanel] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState(null)

  const visibleProducts = useMemo(() => {
    return products.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  const filteredOrders = orders.filter((order) => {
    const text = `${order.customer} ${order.product} ${order.status}`.toLowerCase()
    return text.includes(search.toLowerCase())
  })

  function notify(text) {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  function buy(product) {
    const customer = prompt('Digite seu nome ou Discord:')
    if (!customer) {
      notify('Digite seu nome para confirmar.')
      return
    }

    const order = {
      id: Date.now(),
      customer,
      product: product.name,
      price: product.price,
      status: 'Pendente',
      date: new Date().toLocaleString('pt-BR')
    }

    const updated = [order, ...orders]
    setOrders(updated)
    saveOrders(updated)
    setSelected(order)
    notify('Compra confirmada!')
  }

  function openPanel(type) {
    const password = prompt(type === 'adm' ? 'Digite a senha ADM:' : 'Digite a senha Suporte:')
    const correct = type === 'adm' ? ADM_PASSWORD : SUPPORT_PASSWORD

    if (password !== correct) {
      notify('Senha incorreta.')
      return
    }

    setPanel(type)
    notify(type === 'adm' ? 'Painel ADM aberto.' : 'Painel Suporte aberto.')
  }

  function updateStatus(id, status) {
    const updated = orders.map((order) => order.id === id ? { ...order, status } : order)
    setOrders(updated)
    saveOrders(updated)
    notify('Status atualizado.')
  }

  function clearOrders() {
    if (panel !== 'adm') {
      notify('Somente ADM pode limpar vendas.')
      return
    }

    if (!confirm('Deseja limpar todas as vendas?')) return
    setOrders([])
    saveOrders([])
    notify('Vendas limpas.')
  }

  function copyPix() {
    navigator.clipboard.writeText(PIX_KEY)
    notify('Chave Pix copiada!')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span>STORE</span>
          <strong>TAUROS</strong>
        </div>

        <p className="subtitle">Loja digital premium</p>

        <nav>
          {categories.map((category) => (
            <button
              key={category.id}
              className={activeCategory === category.id ? 'active' : ''}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </nav>

        <div className="panel-buttons">
          <button onClick={() => openPanel('support')}>Login Suporte</button>
          <button onClick={() => openPanel('adm')}>Login ADM</button>
        </div>

        <div className="access">
          <small>Suporte: sptauros</small>
          <small>ADM: stadm</small>
        </div>
      </aside>

      <main className="content">
        <section className="hero">
          <div>
            <span className="pill">+500 clientes • +3 mil vendas</span>
            <h1>Bem-vindo à Store Tauros</h1>
            <p>Produtos Discord, impulsos, Spotify, Nitro Link e design de servidor.</p>
          </div>
          <img src="/assets/banner.jpg" alt="Store Tauros" />
        </section>

        <section className="cards">
          <div className="mini-card">Entrega rápida</div>
          <div className="mini-card">Suporte ativo</div>
          <div className="mini-card">Pagamento via Pix</div>
          <div className="mini-card">Painel ADM/Suporte</div>
        </section>

        <section className="products">
          <div className="section-title">
            <h2>{categories.find((item) => item.id === activeCategory)?.name}</h2>
            <p>Escolha o produto e confirme sua compra.</p>
          </div>

          <div className="grid">
            {visibleProducts.map((product) => (
              <article className="product" key={product.name}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{currency(product.price)}</strong>
                <button onClick={() => buy(product)}>Comprar agora</button>
              </article>
            ))}
          </div>
        </section>

        <section className="payment">
          <h2>Pagamento Pix</h2>
          <div className="payment-grid">
            <img src="/assets/qr-pix.png" alt="QR Pix" />
            <div>
              <p>Chave Pix permanente:</p>
              <strong>{PIX_KEY}</strong>
              <button onClick={copyPix}>Copiar chave Pix</button>
            </div>
          </div>
        </section>

        <section className="orders">
          <h2>Meus pedidos / vendas recentes</h2>
          {orders.length === 0 ? (
            <p>Nenhuma compra confirmada ainda.</p>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div className="order" key={order.id}>
                <b>{order.product}</b>
                <span>{order.customer} • {currency(order.price)} • {order.status}</span>
                <small>{order.date}</small>
              </div>
            ))
          )}
        </section>

        {panel && (
          <section className="admin">
            <h2>{panel === 'adm' ? 'Painel ADM' : 'Painel Suporte'}</h2>
            <p>{panel === 'adm' ? 'Acesso completo para vendas e status.' : 'Acesso para acompanhar pedidos.'}</p>

            <input
              placeholder="Buscar cliente, produto ou status"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <div className="admin-actions">
              <button onClick={() => notify('Vendas atualizadas!')}>Puxar compras</button>
              <button onClick={clearOrders}>Limpar vendas</button>
            </div>

            <div className="admin-list">
              {filteredOrders.length === 0 ? (
                <p>Nenhuma venda encontrada.</p>
              ) : (
                filteredOrders.map((order) => (
                  <div className="admin-order" key={order.id}>
                    <b>{order.product}</b>
                    <span>Cliente: {order.customer}</span>
                    <span>Valor: {currency(order.price)}</span>
                    <small>Status: {order.status} • {order.date}</small>

                    {panel === 'adm' && (
                      <div className="status">
                        <button onClick={() => updateStatus(order.id, 'Pago')}>Pago</button>
                        <button onClick={() => updateStatus(order.id, 'Em entrega')}>Em entrega</button>
                        <button onClick={() => updateStatus(order.id, 'Finalizado')}>Finalizado</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {selected && (
          <div className="modal">
            <div className="modal-box">
              <button className="close" onClick={() => setSelected(null)}>×</button>
              <h2>Compra confirmada!</h2>
              <p>Produto: <b>{selected.product}</b></p>
              <p>Cliente: <b>{selected.customer}</b></p>
              <p>Status: <b>{selected.status}</b></p>
              <p>Após pagar via Pix, abra o suporte para receber.</p>
            </div>
          </div>
        )}

        {message && <div className="toast">{message}</div>}
      </main>
    </div>
  )
}
