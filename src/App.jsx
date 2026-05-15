
import React, { useMemo, useState } from "react";

const DISCORD = "https://discord.gg/WPH5Xc58cm";
const ADMIN_PASS = "admtauros";

const products = [
  {
    key: "discord",
    title: "Discord",
    subtitle: "Veja nossos produtos",
    icon: "discord",
    priceLabel: "R$0,00",
    items: [
      { name: "Membros Mistos", type: "members", unit: 4, icon: "users", desc: "R$4,00 a cada 100 membros." },
      { name: "Membros Reais", type: "members", unit: 5, icon: "users", desc: "R$5,00 a cada 100 membros." },
      { name: "Membros Premium", type: "members", unit: 9, icon: "crown", desc: "R$9,00 a cada 100 membros." },
      { name: "Membros Online", type: "members", unit: 10, icon: "online", desc: "R$10,00 a cada 100 membros online." },
      { name: "Nitro Discord", type: "fixed", price: 6.5, icon: "nitro", desc: "Nitro/Conta Nitrada por R$6,50." },
      { name: "Designer de Server", type: "fixed", price: 65, icon: "designer", desc: "Designer para servidor por R$65,00." }
    ]
  },
  {
    key: "membros",
    title: "Membros Discord",
    subtitle: "Servidores com membros",
    icon: "users",
    priceLabel: "R$4,00+",
    items: [
      { name: "Membros Mistos", type: "members", unit: 4, icon: "users", desc: "R$4,00 a cada 100 membros." },
      { name: "Membros Reais", type: "members", unit: 5, icon: "users", desc: "R$5,00 a cada 100 membros." },
      { name: "Membros Premium", type: "members", unit: 9, icon: "crown", desc: "R$9,00 a cada 100 membros." },
      { name: "Membros Online", type: "members", unit: 10, icon: "online", desc: "R$10,00 a cada 100 membros online." }
    ]
  },
  {
    key: "nitro",
    title: "Nitro Discord",
    subtitle: "Nitro para sua conta",
    icon: "nitro",
    priceLabel: "R$6,50",
    items: [
      { name: "Nitro Discord", type: "fixed", price: 6.5, icon: "nitro", desc: "Nitro/Conta Nitrada por R$6,50." }
    ]
  },
  {
    key: "designer",
    title: "Designer",
    subtitle: "Designer para seu servidor",
    icon: "designer",
    priceLabel: "R$65,00",
    items: [
      { name: "Designer de Server", type: "fixed", price: 65, icon: "designer", desc: "Designer completo para servidor." }
    ]
  },
  {
    key: "online",
    title: "Membros Online",
    subtitle: "100 membros online",
    icon: "online",
    priceLabel: "R$10,00",
    items: [
      { name: "Membros Online", type: "members", unit: 10, icon: "online", desc: "R$10,00 a cada 100 membros online." }
    ]
  }
];

const qtys = [100, 200, 300, 400, 5000];

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Icon({ type, big = false }) {
  return <span className={`icon icon-${type} ${big ? "big" : ""}`} />;
}

export default function App() {
  const [catalog, setCatalog] = useState(null);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(100);
  const [paid, setPaid] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [toast, setToast] = useState("");

  const [authOpen, setAuthOpen] = useState(null);
  const [email, setEmail] = useState(localStorage.getItem("st_email") || "");
  const [logged, setLogged] = useState(!!localStorage.getItem("st_email"));
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("st_users") || "[]"));

  const [adminLogin, setAdminLogin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [pix, setPix] = useState(localStorage.getItem("st_pix") || "");
  const [qr, setQr] = useState(localStorage.getItem("st_qr") || "");
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("st_orders") || "[]"));

  const price = useMemo(() => {
    if (!selected) return "";
    if (selected.type === "members") return money((qty / 100) * selected.unit);
    return money(selected.price);
  }, [selected, qty]);

  const myOrders = logged ? orders.filter((o) => o.client === email) : [];

  function notify(text) {
    setToast(text);
    setTimeout(() => setToast(""), 3500);
  }

  function openCatalog(product) {
    setCatalog(product);
    setMobile(false);
  }

  function choose(item) {
    setSelected(item);
    setQty(100);
    setPaid(false);
    setCatalog(null);
  }

  function loginUser() {
    if (!email.includes("@")) return alert("Digite um email válido.");
    const user = { email, date: new Date().toLocaleString("pt-BR") };
    const exists = users.some((u) => u.email === email);
    const nextUsers = exists ? users : [user, ...users];
    setUsers(nextUsers);
    localStorage.setItem("st_users", JSON.stringify(nextUsers));
    localStorage.setItem("st_email", email);
    setLogged(true);
    setAuthOpen(null);
    notify(authOpen === "create" ? "Conta criada com sucesso!" : "Login realizado!");
  }

  function logout() {
    localStorage.removeItem("st_email");
    setLogged(false);
    setEmail("");
    notify("Você saiu da conta.");
  }

  function loginAdmin() {
    if (adminPass === ADMIN_PASS) {
      setAdminLogin(false);
      setAdminOpen(true);
      setAdminPass("");
    } else {
      alert("Senha incorreta.");
    }
  }

  function saveAdmin() {
    localStorage.setItem("st_pix", pix);
    localStorage.setItem("st_qr", qr);
    notify("Pix e QR salvos no painel admin!");
  }

  function uploadQr(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setQr(String(reader.result));
    reader.readAsDataURL(file);
  }

  function copyPix() {
    if (!pix) return alert("Pix ainda não cadastrado no painel admin.");
    navigator.clipboard.writeText(pix);
    notify("Pix copiado!");
  }

  function confirmPayment() {
    const order = {
      id: "ST-" + Math.floor(1000 + Math.random() * 9000),
      product: selected.type === "members" ? `${qty} ${selected.name}` : selected.name,
      price,
      client: logged ? email : "Sem login",
      status: "Pagamento confirmado pelo cliente",
      date: new Date().toLocaleString("pt-BR")
    };

    const next = [order, ...orders];
    setOrders(next);
    localStorage.setItem("st_orders", JSON.stringify(next));
    setPaid(true);
    notify("Compra registrada! Abra o Discord para resgatar.");
  }

  return (
    <div className="screen">
      {toast && <div className="toast">🔔 {toast}</div>}

      <button className="mobile-menu" onClick={() => setMobile(true)}>☰</button>

      <aside className={`sidebar ${mobile ? "show" : ""}`}>
        <button className="mobile-close" onClick={() => setMobile(false)}>×</button>

        <div className="profile">
          <div className="logo-mark"><div className="bull-face" /></div>
          <div>
            <b>STORE TAUROS</b>
            <small>Loja oficial</small>
          </div>
        </div>

        <p className="label">MENU</p>
        <a className="nav active" href="#inicio" onClick={() => setMobile(false)}>⌂ <span>Início</span></a>
        <button className="nav" onClick={() => openCatalog(products[0])}>▣ <span>Produtos</span></button>
        <button className="nav" onClick={() => openCatalog(products[0])}>☯ <span>Discord</span><i>⌄</i></button>
        <a className="nav" href="#pagamento" onClick={() => setMobile(false)}>◇ <span>Pix</span></a>
        <button className="nav" onClick={() => window.open(DISCORD, "_blank")}>◌ <span>Suporte</span></button>

        <p className="label">ADMINISTRAÇÃO</p>
        <button className="nav admin" onClick={() => setAdminLogin(true)}>♢ <span>Painel Admin</span></button>
        <button className="nav" onClick={() => setAdminLogin(true)}>↪ <span>Login Admin</span></button>

        <p className="label">CONTA</p>
        {logged ? (
          <>
            <button className="nav" onClick={() => setCatalog({ title: "Meus pedidos", subtitle: "Histórico da sua conta", custom: "orders" })}>📦 <span>Meus pedidos</span></button>
            <button className="nav" onClick={logout}>↪ <span>Sair</span></button>
          </>
        ) : (
          <>
            <button className="nav" onClick={() => setAuthOpen("login")}>↪ <span>Entrar</span></button>
            <button className="nav" onClick={() => setAuthOpen("create")}>☊ <span>Criar conta</span></button>
          </>
        )}

        <div className="discord-access">
          <div className="discord-icon-small">☯</div>
          <div>
            <b>Acessar Discord</b>
            <small>Comunidade oficial</small>
          </div>
          <button onClick={() => window.open(DISCORD, "_blank")}>Entrar</button>
        </div>
      </aside>

      <main className="main">
        <section id="inicio" className="hero">
          <div className="hero-copy">
            <h1>Bem-Vindo(a) à<br /><span>Store Tauros!</span></h1>
            <p>Aqui você encontra tudo para elevar sua experiência, com produtos digitais premium, entrega automática e suporte dedicado!</p>

            <div className="badges">
              <div><span>♢</span><b>Entrega automática</b><small>Instantânea</small></div>
              <div><span>▱</span><b>100% Seguro</b><small>Dados protegidos</small></div>
              <div><span>◌</span><b>Suporte 24/7</b><small>Sempre disponível</small></div>
            </div>
          </div>

          <div className="hero-brand">
            <div className="bull-large" />
            <h2>TAUROS</h2>
            <strong>STORE</strong>
          </div>
        </section>

        <section className="products">
          <h2>Nossos Produtos</h2>
          <p>Produtos digitais premium para você!</p>

          <div className="cards">
            {products.map((product) => (
              <button className="product-card" key={product.key} onClick={() => openCatalog(product)}>
                <div className={`product-art ${product.key}`}>
                  <Icon type={product.icon} big />
                </div>
                <div className="product-info">
                  <div>
                    <h3>{product.title}</h3>
                    <p>{product.subtitle}</p>
                    <b className="card-price">{product.priceLabel}</b>
                  </div>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="pagamento" className="payment">
          <h2>Pagamento</h2>
          <p>Formas de pagamento</p>

          <button className="payment-card" onClick={() => notify("A chave Pix aparece ao comprar um produto.")}>
            <div className="pix-logo">◆</div>
            <div>
              <b>Apenas Pix</b>
              <small>Pagamento via PIX</small>
            </div>
            <span>→</span>
          </button>
        </section>

        <div className="help-card">
          <b>Precisa de ajuda?</b>
          <small>Entre no nosso Discord!</small>
          <button onClick={() => window.open(DISCORD, "_blank")}>☯</button>
        </div>
      </main>

      {catalog && (
        <div className="modal-bg">
          <div className="modal catalog-modal">
            <button className="close" onClick={() => setCatalog(null)}>×</button>
            <h2>{catalog.title}</h2>
            <p>{catalog.subtitle}</p>

            {catalog.custom === "orders" ? (
              <div className="catalog-list">
                {myOrders.length === 0 ? <p>Nenhum pedido encontrado.</p> : myOrders.map((order) => (
                  <div className="order-card" key={order.id}>
                    <b>{order.product}</b>
                    <small>{order.price} • {order.status} • {order.date}</small>
                  </div>
                ))}
              </div>
            ) : (
              <div className="catalog-list">
                {catalog.items.map((item) => (
                  <button key={item.name} onClick={() => choose(item)}>
                    <Icon type={item.icon} />
                    <div>
                      <b>{item.name}</b>
                      <small>{item.desc}</small>
                    </div>
                    <strong>{item.type === "members" ? `A partir de ${money(item.unit)}` : money(item.price)}</strong>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-bg">
          <div className="modal checkout">
            <button className="close" onClick={() => setSelected(null)}>×</button>

            <div className="checkout-art">
              <Icon type={selected.icon} big />
            </div>

            <div>
              <span className="stock">Disponível</span>
              <h2>{selected.name}</h2>
              <p>{selected.desc}</p>

              {selected.type === "members" && (
                <select value={qty} onChange={(event) => setQty(Number(event.target.value))}>
                  {qtys.map((q) => (
                    <option key={q} value={q}>{q} membros - {money((q / 100) * selected.unit)}</option>
                  ))}
                </select>
              )}

              <strong className="price">{price}</strong>

              <div className="pay-box">
                <h3>Pagamento Pix</h3>
                <p>{pix || "Pix ainda não cadastrado no painel admin."}</p>
                <button onClick={copyPix}>Copiar Pix</button>
                {qr && <img src={qr} alt="QR Pix" />}
              </div>

              {!paid ? (
                <button className="buy" onClick={confirmPayment}>Confirmar pagamento</button>
              ) : (
                <div className="success">
                  <h3>✅ Pagamento confirmado!</h3>
                  <p>Abra o Discord para resgatar seu pedido.</p>
                  <a href={DISCORD} target="_blank">Abrir Discord</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {authOpen && (
        <div className="modal-bg">
          <div className="modal auth">
            <button className="close" onClick={() => setAuthOpen(null)}>×</button>
            <h2>{authOpen === "create" ? "Criar conta" : "Entrar"}</h2>
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            <input type="password" placeholder="Senha" />
            {authOpen === "create" && <input type="password" placeholder="Confirmar senha" />}
            <button onClick={loginUser}>{authOpen === "create" ? "Criar conta" : "Entrar"}</button>
          </div>
        </div>
      )}

      {adminLogin && (
        <div className="modal-bg">
          <div className="modal auth">
            <button className="close" onClick={() => setAdminLogin(false)}>×</button>
            <h2>Login Admin</h2>
            <input type="password" placeholder="Senha: admtauros" value={adminPass} onChange={(event) => setAdminPass(event.target.value)} />
            <button onClick={loginAdmin}>Entrar</button>
          </div>
        </div>
      )}

      {adminOpen && (
        <div className="modal-bg">
          <div className="modal admin-panel">
            <button className="close" onClick={() => setAdminOpen(false)}>×</button>
            <h2>Painel de Administração</h2>

            <div className="admin-grid">
              <section>
                <h3>Pix e QR</h3>
                <input placeholder="Chave Pix" value={pix} onChange={(event) => setPix(event.target.value)} />
                <input type="file" accept="image/*" onChange={uploadQr} />
                {qr && <img className="qr" src={qr} />}
                <button onClick={saveAdmin}>Salvar Pix/QR</button>
              </section>

              <section>
                <h3>Clientes cadastrados</h3>
                <div className="orders">
                  {users.length === 0 ? <p>Nenhum cliente.</p> : users.map((user) => (
                    <div key={user.email}>
                      <b>{user.email}</b>
                      <small>{user.date}</small>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3>Vendas</h3>
                <div className="orders">
                  {orders.length === 0 ? <p>Nenhuma venda.</p> : orders.map((order) => (
                    <div key={order.id}>
                      <b>{order.product}</b>
                      <small>{order.price} • {order.client} • {order.status} • {order.date}</small>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setOrders([]); localStorage.removeItem("st_orders"); }}>Limpar vendas</button>
              </section>

              <section>
                <h3>Discord</h3>
                <p>{DISCORD}</p>
                <button onClick={() => window.open(DISCORD, "_blank")}>Abrir Discord</button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
