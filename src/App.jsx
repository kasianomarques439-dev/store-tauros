
import React, { useMemo, useState } from "react";

const DISCORD_LINK = "https://discord.gg/WPH5Xc58cm";
const ADMIN_PASSWORD = "admtauros";

const memberTypes = [
  {
    id: "mistos",
    title: "Membros Mistos",
    pricePer100: 2,
    description: "Membros mistos para movimentar seu servidor com custo menor.",
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1200&auto=format&fit=crop",
    accent: "green"
  },
  {
    id: "reais",
    title: "Membros Reais",
    pricePer100: 2.5,
    description: "Membros reais e ativos para fortalecer sua comunidade.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    accent: "blue"
  },
  {
    id: "premium",
    title: "Membros Premium",
    pricePer100: 6.5,
    description: "Membros premium com maior qualidade para seu servidor.",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1200&auto=format&fit=crop",
    accent: "purple"
  }
];

const extras = [
  {
    id: "designer",
    title: "Designer de Server",
    fixedPrice: 35,
    description: "Cargos, canais, decoração, organização e identidade visual do servidor.",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop",
    accent: "cyan"
  },
  {
    id: "nitrada",
    title: "Conta Nitrada",
    fixedPrice: 5,
    description: "Conta nitrada com resgate feito somente pelo ticket no Discord.",
    image: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?q=80&w=1200&auto=format&fit=crop",
    accent: "pink"
  }
];

const quantities = [100, 200, 300, 400, 5000];

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function App() {
  const [activeType, setActiveType] = useState("mistos");
  const [selected, setSelected] = useState(null);
  const [paid, setPaid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [pixKey, setPixKey] = useState(localStorage.getItem("storetauros_pix_key") || "cadastre-sua-chave-pix");
  const [pixQr, setPixQr] = useState(localStorage.getItem("storetauros_pix_qr") || "");
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("storetauros_orders") || "[]"));

  const activeMember = useMemo(
    () => memberTypes.find((item) => item.id === activeType) || memberTypes[0],
    [activeType]
  );

  const memberOptions = useMemo(() => {
    return quantities.map((quantity) => ({
      id: `${activeMember.id}-${quantity}`,
      title: `${quantity.toLocaleString("pt-BR")} ${activeMember.title}`,
      description: activeMember.description,
      price: money((quantity / 100) * activeMember.pricePer100),
      image: activeMember.image,
      accent: activeMember.accent,
      quantity
    }));
  }, [activeMember]);

  function registerOrder(product) {
    const order = {
      id: "ST-" + Math.floor(1000 + Math.random() * 9000),
      product: product.title,
      price: product.price,
      date: new Date().toLocaleString("pt-BR"),
      status: "Pagamento confirmado - aguardando ticket"
    };

    const updated = [order, ...orders];
    setOrders(updated);
    localStorage.setItem("storetauros_orders", JSON.stringify(updated));
  }

  function openPurchase(product) {
    setSelected(product);
    setPaid(false);
  }

  function confirmPayment() {
    if (!selected) return;
    registerOrder(selected);
    setPaid(true);
  }

  function copyPix() {
    navigator.clipboard.writeText(pixKey);
    alert("Chave Pix copiada!");
  }

  function loginAdmin() {
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminLoginOpen(false);
      setAdminOpen(true);
      setAdminPassword("");
    } else {
      alert("Chave admin incorreta.");
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
    alert("Configurações salvas!");
  }

  function clearOrders() {
    setOrders([]);
    localStorage.removeItem("storetauros_orders");
  }

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="sideLogo">
          <span>🐂</span>
          <b>ST</b>
        </div>
        <a href="#inicio">⌂</a>
        <a href="#membros">▦</a>
        <a href="#extras">◆</a>
        <a href="#pix">◇</a>
        <button onClick={() => setAdminLoginOpen(true)}>⚙</button>
      </aside>

      <main className="content">
        <header className="topbar">
          <button className="menuDots" onClick={() => setMenuOpen(true)}>•••</button>
          <div className="brand">
            <span>STORE</span><b>TAUROS</b>
            <small>A loja premium para Discord</small>
          </div>
          <button className="adminButton" onClick={() => setAdminLoginOpen(true)}>Área do Admin</button>
        </header>

        <section id="inicio" className="hero">
          <div className="heroCopy">
            <p className="tag">A MELHOR STORE PARA SEU DISCORD</p>
            <h1>Turbine seu servidor com a <span>StoreTauros</span></h1>
            <p className="lead">
              Membros mistos, reais e premium, designer de servidor e conta nitrada.
              Pagamento via Pix, confirmação manual e resgate direto pelo ticket Discord.
            </p>
            <div className="actions">
              <a href="#membros">Ver pacotes</a>
              <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Abrir Discord</button>
            </div>
          </div>

          <div className="heroCard">
            <div className="discordIcon">💬</div>
            <h3>Resgate via Ticket</h3>
            <p>Após confirmar o pagamento, o botão do Discord aparece para resgatar o pedido.</p>
            <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Suporte Discord</button>
          </div>
        </section>

        <section className="statusGrid">
          <div>⚡ <b>Entrega</b><span>via ticket</span></div>
          <div>💠 <b>Pix</b><span>QR e chave única</span></div>
          <div>🛡️ <b>Seguro</b><span>confirmação manual</span></div>
          <div>⭐ <b>Premium</b><span>visual profissional</span></div>
        </section>

        <section id="membros" className="section">
          <div className="sectionHead">
            <div>
              <h2>Membros para Discord</h2>
              <p>Escolha o tipo e depois a quantidade desejada.</p>
            </div>
            <span>{memberOptions.length} pacotes</span>
          </div>

          <div className="tabs">
            {memberTypes.map((type) => (
              <button
                key={type.id}
                className={activeType === type.id ? "active" : ""}
                onClick={() => setActiveType(type.id)}
              >
                {type.title}
                <small>{money(type.pricePer100)} por 100</small>
              </button>
            ))}
          </div>

          <div className="productGrid">
            {memberOptions.map((product) => (
              <article className={`productCard ${product.accent}`} key={product.id}>
                <div className="productImage" style={{ backgroundImage: `url(${product.image})` }}>
                  <span>{product.quantity.toLocaleString("pt-BR")} membros</span>
                </div>
                <div className="productBody">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <strong>{product.price}</strong>
                  <button onClick={() => openPurchase(product)}>Comprar agora</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="extras" className="section">
          <div className="sectionHead">
            <div>
              <h2>Outros produtos</h2>
              <p>Produtos extras para deixar o servidor completo.</p>
            </div>
          </div>

          <div className="productGrid extraGrid">
            {extras.map((product) => (
              <article className={`productCard ${product.accent}`} key={product.id}>
                <div className="productImage" style={{ backgroundImage: `url(${product.image})` }}>
                  <span>{product.title}</span>
                </div>
                <div className="productBody">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <strong>{money(product.fixedPrice)}</strong>
                  <button
                    onClick={() =>
                      openPurchase({
                        title: product.title,
                        description: product.description,
                        image: product.image,
                        price: money(product.fixedPrice),
                        accent: product.accent
                      })
                    }
                  >
                    Comprar agora
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="pix" className="pixPanel">
          <div>
            <h2>Pagamento via Pix</h2>
            <p>A mesma chave Pix vale para todos os produtos da loja.</p>
          </div>

          <div className="pixKey">
            <small>Chave Pix cadastrada</small>
            <b>{pixKey}</b>
            <button onClick={copyPix}>Copiar</button>
          </div>

          <div className="qrBox">
            {pixQr ? <img src={pixQr} alt="QR Code Pix" /> : <span>QR Code Pix será cadastrado no Admin</span>}
          </div>
        </section>

        <section className="how">
          <h2>Como funciona</h2>
          <div>
            <article><b>1</b><span>Escolha o produto</span></article>
            <article><b>2</b><span>Copie o Pix ou QR</span></article>
            <article><b>3</b><span>Confirme pagamento</span></article>
            <article><b>4</b><span>Resgate no Discord</span></article>
          </div>
        </section>

        <footer>
          <b>StoreTauros</b>
          <span>© 2026 — loja online Discord com resgate via ticket.</span>
        </footer>
      </main>

      {menuOpen && (
        <div className="modalBg">
          <div className="menuModal">
            <button className="close" onClick={() => setMenuOpen(false)}>×</button>
            <h2>Menu StoreTauros</h2>
            <a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a>
            <a href="#membros" onClick={() => setMenuOpen(false)}>Membros</a>
            <a href="#extras" onClick={() => setMenuOpen(false)}>Outros produtos</a>
            <a href="#pix" onClick={() => setMenuOpen(false)}>Pix</a>
            <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Suporte Discord</button>
          </div>
        </div>
      )}

      {selected && (
        <div className="modalBg">
          <div className="purchaseModal">
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <img src={selected.image} alt={selected.title} />
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <strong className="modalPrice">{selected.price}</strong>

            <div className="paymentBox">
              <h3>Pagamento Pix</h3>
              <p>{pixKey}</p>
              <button onClick={copyPix}>Copiar Pix</button>
              {pixQr && <img src={pixQr} alt="QR Pix" />}
            </div>

            {!paid ? (
              <button className="confirmButton" onClick={confirmPayment}>Já paguei, confirmar pagamento</button>
            ) : (
              <div className="confirmedBox">
                <h3>✅ Pagamento confirmado!</h3>
                <p>Agora clique abaixo para resgatar seu pedido no Discord.</p>
                <a href={DISCORD_LINK} target="_blank" rel="noreferrer">Abrir Discord para resgatar</a>
              </div>
            )}
          </div>
        </div>
      )}

      {adminLoginOpen && (
        <div className="modalBg">
          <div className="adminLogin">
            <button className="close" onClick={() => setAdminLoginOpen(false)}>×</button>
            <h2>Área Privada Admin</h2>
            <p>Chave de acesso: admtauros</p>
            <input
              type="password"
              placeholder="Digite a chave admin"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && loginAdmin()}
            />
            <button onClick={loginAdmin}>Entrar</button>
          </div>
        </div>
      )}

      {adminOpen && (
        <div className="modalBg">
          <div className="adminPanel">
            <button className="close" onClick={() => setAdminOpen(false)}>×</button>
            <h2>Configurações Admin</h2>

            <div className="adminGrid">
              <section>
                <h3>Chave Pix única</h3>
                <p>Essa chave aparece em todos os produtos.</p>
                <input value={pixKey} onChange={(event) => setPixKey(event.target.value)} />
                <h3>QR Code Pix</h3>
                <input type="file" accept="image/*" onChange={uploadQr} />
                <button onClick={saveAdmin}>Salvar Pix e QR</button>
                {pixQr && <img className="qrPreview" src={pixQr} alt="Prévia do QR Pix" />}
              </section>

              <section>
                <h3>Painel de vendas</h3>
                <p>{orders.length} pedidos registrados neste navegador.</p>
                <div className="salesList">
                  {orders.length === 0 && <span>Nenhum pedido registrado.</span>}
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

              <section>
                <h3>Discord de resgate</h3>
                <p>{DISCORD_LINK}</p>
                <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Abrir Discord</button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
