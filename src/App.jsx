
import React, { useState } from "react";

const DISCORD_LINK = "https://discord.gg/WPH5Xc58cm";
const ADMIN_PASS = "admtauros";

const products = [
  {
    id: "misto",
    title: "Membros Mistos",
    subtitle: "Pacotes para turbinar seu servidor",
    price: "R$ 2,00 / 100",
    icon: "👥",
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1400&auto=format&fit=crop",
    color: "blue"
  },
  {
    id: "real",
    title: "Membros Reais",
    subtitle: "Membros reais para comunidade",
    price: "R$ 2,50 / 100",
    icon: "🧑‍🤝‍🧑",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop",
    color: "green"
  },
  {
    id: "premium",
    title: "Membros Premium",
    subtitle: "Qualidade superior para Discord",
    price: "R$ 6,50 / 100",
    icon: "👑",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1400&auto=format&fit=crop",
    color: "purple"
  },
  {
    id: "nitro",
    title: "Nitro Discord",
    subtitle: "Símbolo Nitro para ativação via ticket",
    price: "R$ 5,00",
    icon: "💎",
    image: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?q=80&w=1400&auto=format&fit=crop",
    color: "pink"
  },
  {
    id: "designer",
    title: "Designer de Server",
    subtitle: "Cargos, canais e visual profissional",
    price: "R$ 35,00",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1400&auto=format&fit=crop",
    color: "cyan"
  }
];

export default function App() {
  const [quickMenu, setQuickMenu] = useState(false);
  const [selected, setSelected] = useState(null);
  const [paid, setPaid] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [pixKey, setPixKey] = useState(localStorage.getItem("storetauros_pix_key") || "");
  const [pixQr, setPixQr] = useState(localStorage.getItem("storetauros_pix_qr") || "");
  const [coupon, setCoupon] = useState(localStorage.getItem("storetauros_coupon") || "TAUROS10");
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("storetauros_orders") || "[]"));

  function selectProduct(product) {
    setSelected(product);
    setPaid(false);
  }

  function confirmPayment() {
    if (!selected) return;
    const order = {
      id: "ST-" + Math.floor(1000 + Math.random() * 9000),
      product: selected.title,
      price: selected.price,
      date: new Date().toLocaleString("pt-BR"),
      status: "Confirmado - aguardando ticket"
    };
    const updated = [order, ...orders];
    setOrders(updated);
    localStorage.setItem("storetauros_orders", JSON.stringify(updated));
    setPaid(true);
  }

  function copyPix() {
    if (!pixKey.trim()) return alert("O admin ainda não cadastrou a chave Pix.");
    navigator.clipboard.writeText(pixKey);
    alert("Chave Pix copiada!");
  }

  function loginAdmin() {
    if (adminPassword === ADMIN_PASS) {
      setAdminLogin(false);
      setAdminOpen(true);
      setAdminPassword("");
    } else {
      alert("Senha incorreta.");
    }
  }

  function uploadQr(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPixQr(String(reader.result));
    reader.readAsDataURL(file);
  }

  function saveAdmin() {
    localStorage.setItem("storetauros_pix_key", pixKey);
    localStorage.setItem("storetauros_pix_qr", pixQr);
    localStorage.setItem("storetauros_coupon", coupon);
    alert("Configurações salvas.");
  }

  function clearOrders() {
    setOrders([]);
    localStorage.removeItem("storetauros_orders");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sideBrand">🐂</div>
        <a href="#inicio">⌂<span>Início</span></a>
        <a href="#categorias">▦<span>Produtos</span></a>
        <a href="#avaliacoes">★<span>Feedback</span></a>
        <button onClick={() => window.open(DISCORD_LINK, "_blank")}>🎧<span>Suporte</span></button>
        <button onClick={() => setAdminLogin(true)}>⚙<span>Admin</span></button>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="menuButton" onClick={() => setQuickMenu(true)}>☰</button>
          <div className="brand">
            <strong>STORE<span>TAUROS</span></strong>
            <small>A melhor store para Discord</small>
          </div>
          <nav>
            <a href="#inicio">Início</a>
            <a href="#categorias">Categorias</a>
            <a href="#como">Como funciona</a>
            <a href="#avaliacoes">Avaliações</a>
          </nav>
          <button className="loginBtn" onClick={() => setAdminLogin(true)}>Área Admin</button>
        </header>

        <section id="inicio" className="hero">
          <video className="heroVideo" autoPlay muted loop playsInline>
            <source src="/storetauros-video.mp4" type="video/mp4" />
          </video>
          <div className="heroOverlay" />
          <div className="heroContent">
            <p className="label">Cupom ativo: {coupon}</p>
            <h1>Bem-vindo à <span>StoreTauros</span></h1>
            <p>Loja gamer para Discord com membros, nitro e designer de servidor. Compra rápida e resgate direto pelo ticket.</p>
            <div className="heroActions">
              <a href="#categorias">Ver produtos</a>
              <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Comunidade Discord</button>
            </div>
          </div>
        </section>

        <section className="reviews" id="avaliacoes">
          <h2>O que nossos clientes dizem</h2>
          <div className="reviewTrack">
            {["Atendimento rápido, entregou certinho!", "Preço bom e suporte ativo.", "Meu servidor ficou mais movimentado.", "Design ficou muito profissional."].map((text, index) => (
              <article key={index}>
                <b>{["Tiago", "Luna", "Willian", "Bruno"][index]}</b>
                <span>★★★★★</span>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="categorias" className="categories">
          <div className="sectionHeader">
            <div>
              <h2>Categorias</h2>
              <p>Escolha uma categoria para comprar.</p>
            </div>
            <span>{products.length} disponíveis</span>
          </div>

          <div className="categoryGrid">
            {products.map((product) => (
              <button className={`categoryCard ${product.color}`} key={product.id} onClick={() => selectProduct(product)}>
                <div className="categoryImage" style={{ backgroundImage: `url(${product.image})` }}>
                  <span>{product.icon}</span>
                </div>
                <div className="categoryBody">
                  <h3>{product.title}</h3>
                  <p>{product.subtitle}</p>
                  <small>{product.price}</small>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="como" className="how">
          <h2>Como funciona</h2>
          <div>
            <article><b>1</b><h3>Escolha</h3><p>Selecione o produto desejado.</p></article>
            <article><b>2</b><h3>Pagamento</h3><p>Use o Pix ou QR cadastrado pelo admin.</p></article>
            <article><b>3</b><h3>Confirmação</h3><p>Clique em confirmar pagamento.</p></article>
            <article><b>4</b><h3>Resgate</h3><p>Abra o Discord para resgatar.</p></article>
          </div>
        </section>

        <section className="support">
          <div>
            <h2>Suporte</h2>
            <p>Precisa de ajuda? Nosso suporte atende pelo Discord.</p>
          </div>
          <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Falar com suporte</button>
        </section>

        <footer>
          <div className="brand footerBrand">
            <strong>STORE<span>TAUROS</span></strong>
            <small>Resgate via ticket Discord</small>
          </div>
          <p>Copyright © 2026 - StoreTauros.</p>
        </footer>
      </main>

      {quickMenu && (
        <div className="modalBg">
          <div className="menuModal">
            <button className="close" onClick={() => setQuickMenu(false)}>×</button>
            <h2>Menu rápido</h2>
            <a onClick={() => setQuickMenu(false)} href="#categorias">Categorias</a>
            <a onClick={() => setQuickMenu(false)} href="#como">Como funciona</a>
            <a onClick={() => setQuickMenu(false)} href="#avaliacoes">Avaliações</a>
            <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Suporte Discord</button>
            <button onClick={() => setAdminLogin(true)}>Área Admin</button>
          </div>
        </div>
      )}

      {selected && (
        <div className="modalBg">
          <div className="purchaseModal">
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <img src={selected.image} alt={selected.title} />
            <h2>{selected.title}</h2>
            <p>{selected.subtitle}</p>
            <strong className="price">{selected.price}</strong>

            <div className="paymentBox">
              <h3>Pagamento Pix</h3>
              {pixKey ? <p>{pixKey}</p> : <p>Pix ainda não cadastrado pelo admin.</p>}
              <button onClick={copyPix}>Copiar Pix</button>
              {pixQr ? <img src={pixQr} alt="QR Code Pix" /> : <span>QR Pix ainda não cadastrado.</span>}
            </div>

            {!paid ? (
              <button className="confirm" onClick={confirmPayment}>Já paguei, confirmar pagamento</button>
            ) : (
              <div className="confirmed">
                <h3>✅ Pagamento confirmado!</h3>
                <p>Agora abra o Discord para resgatar seu pedido.</p>
                <a href={DISCORD_LINK} target="_blank" rel="noreferrer">Abrir Discord para resgate</a>
              </div>
            )}
          </div>
        </div>
      )}

      {adminLogin && (
        <div className="modalBg">
          <div className="adminLogin">
            <button className="close" onClick={() => setAdminLogin(false)}>×</button>
            <h2>Área privada do admin</h2>
            <p>Digite a senha para acessar as configurações.</p>
            <input type="password" placeholder="Senha: admtauros" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && loginAdmin()} />
            <button onClick={loginAdmin}>Entrar</button>
          </div>
        </div>
      )}

      {adminOpen && (
        <div className="modalBg">
          <div className="adminPanel">
            <button className="close" onClick={() => setAdminOpen(false)}>×</button>
            <h2>Configurações da StoreTauros</h2>
            <div className="adminGrid">
              <section>
                <h3>Pix único</h3>
                <input value={pixKey} onChange={(event) => setPixKey(event.target.value)} placeholder="Chave Pix" />
                <h3>QR Pix</h3>
                <input type="file" accept="image/*" onChange={uploadQr} />
                {pixQr && <img className="previewQr" src={pixQr} alt="QR Pix" />}
                <button onClick={saveAdmin}>Salvar Pix e QR</button>
              </section>
              <section>
                <h3>Configurações da loja</h3>
                <label>Cupom do banner</label>
                <input value={coupon} onChange={(event) => setCoupon(event.target.value)} />
                <button onClick={saveAdmin}>Salvar cupom</button>
                <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Abrir Discord</button>
              </section>
              <section>
                <h3>Painel de vendas</h3>
                <p>{orders.length} pedidos registrados.</p>
                <div className="orders">
                  {orders.length === 0 && <span>Nenhuma venda registrada.</span>}
                  {orders.map((order) => (
                    <div key={order.id}>
                      <b>{order.product}</b>
                      <small>{order.price} • {order.date}</small>
                      <em>{order.status}</em>
                    </div>
                  ))}
                </div>
                <button onClick={clearOrders}>Limpar vendas</button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
