import { useEffect, useMemo, useState } from "react";
import {
  Home,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  UserPlus,
  LogIn,
  Copy,
  X,
  QrCode,
  Trash2,
  Save,
  Upload,
  Crown,
  Users,
  Brush,
  Menu,
  CheckCircle2,
  Wallet,
  ExternalLink,
  BadgeDollarSign
} from "lucide-react";

const DISCORD_LINK = "https://discord.gg/SXZCqeqMRM";
const ADMIN_PASSWORD = "admtauros";

const productList = [
  {
    id: "membros-mistos",
    title: "100 membros mistos",
    desc: "Membros reais e mistos para crescer seu servidor.",
    price: 4,
    type: "unit",
    img: "/assets/produto-membros-discord.png",
    icon: Users,
  },
  {
    id: "membros-reais",
    title: "100 membros reais",
    desc: "Entrega digital após pagamento.",
    price: 5,
    type: "unit",
    img: "/assets/produto-membros-discord.png",
    icon: Users,
  },
  {
    id: "membros-premium",
    title: "100 membros premium",
    desc: "Membros premium para destacar seu servidor.",
    price: 9,
    type: "unit",
    img: "/assets/produto-membros-discord.png",
    icon: Users,
  },
  {
    id: "membros-online",
    title: "100 membros online",
    desc: "Pacote de membros online.",
    price: 10,
    type: "unit",
    img: "/assets/produto-membros-discord.png",
    icon: Users,
  },
  {
    id: "nitro-discord",
    title: "Nitro Discord",
    desc: "Nitro para sua conta Discord.",
    price: 6.5,
    type: "fixed",
    img: "/assets/produto-nitro-gaming.png",
    icon: Crown,
  },
  {
    id: "conta-nitrada",
    title: "Conta Nitrada",
    desc: "Conta nitrada digital.",
    price: 15,
    type: "fixed",
    img: "/assets/produto-conta-nitrada.png",
    icon: Crown,
  },
  {
    id: "designer-servidor",
    title: "Designer servidor",
    desc: "Designer completo para seu servidor.",
    price: 65,
    type: "fixed",
    img: "/assets/referencia-site.png",
    icon: Brush,
  },
];

function currency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pixKey, setPixKey] = useState(localStorage.getItem("tauros_pix_key") || "SUA-CHAVE-PIX-AQUI");
  const [qrImage, setQrImage] = useState(localStorage.getItem("tauros_qr") || "");
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("tauros_user") || "null"));
  const [toast, setToast] = useState("");

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem("tauros_orders") || "[]"));
    setClients(JSON.parse(localStorage.getItem("tauros_clients") || "[]"));
  }, []);

  const total = useMemo(() => {
    if (!selected) return 0;
    return Number((selected.price * quantity).toFixed(2));
  }, [selected, quantity]);

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }

  function saveOrders(next) {
    setOrders(next);
    localStorage.setItem("tauros_orders", JSON.stringify(next));
  }

  function saveClients(next) {
    setClients(next);
    localStorage.setItem("tauros_clients", JSON.stringify(next));
  }

  function createAccount() {
    const name = prompt("Digite seu nome:");
    if (!name) return;
    const email = prompt("Digite seu email ou Discord:");
    if (!email) return;

    const newUser = { name, email, createdAt: new Date().toLocaleString("pt-BR") };
    setUser(newUser);
    localStorage.setItem("tauros_user", JSON.stringify(newUser));

    const next = [...clients, newUser];
    saveClients(next);
    notify("Conta criada com sucesso!");
  }

  function login() {
    const email = prompt("Digite seu email ou Discord:");
    if (!email) return;
    const found = clients.find((c) => c.email === email) || { name: "Cliente Tauros", email, createdAt: new Date().toLocaleString("pt-BR") };
    setUser(found);
    localStorage.setItem("tauros_user", JSON.stringify(found));
    notify("Login realizado!");
  }

  function adminLogin() {
    const pass = prompt("Senha do painel admin:");
    if (pass === ADMIN_PASSWORD) {
      setAdminOpen(true);
      notify("Painel admin aberto!");
    } else {
      notify("Senha incorreta.");
    }
  }

  function finishOrder() {
    const buyer = user || { name: "Cliente sem login", email: "Não informado" };
    const order = {
      id: Date.now(),
      produto: selected.title,
      quantidade: quantity,
      total: currency(total),
      cliente: buyer.name,
      contato: buyer.email,
      status: "Aguardando resgate no Discord",
      data: new Date().toLocaleString("pt-BR"),
    };

    const nextOrders = [order, ...orders];
    saveOrders(nextOrders);

    if (!user) {
      const anon = { name: buyer.name, email: buyer.email, createdAt: order.data };
      saveClients([anon, ...clients]);
    }

    notify("Compra registrada! Indo para o Discord...");
    setSelected(null);
    setTimeout(() => window.open(DISCORD_LINK, "_blank"), 500);
  }

  function handleQrUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setQrImage(reader.result);
      localStorage.setItem("tauros_qr", reader.result);
      notify("QR Code salvo!");
    };
    reader.readAsDataURL(file);
  }

  function clearSales() {
    if (confirm("Deseja limpar todas as vendas?")) {
      saveOrders([]);
      notify("Vendas limpas.");
    }
  }

  return (
    <div className="page">
      <div className="bg"></div>
      <div className="overlay"></div>

      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu size={25} />
      </button>

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="bull-logo">
            <span>♉</span>
          </div>
          <div>
            <strong>STORE TAUROS</strong>
            <small>Loja oficial digital</small>
          </div>
        </div>

        <p className="menu-title">MENU</p>
        <a href="#inicio"><Home /> Início</a>
        <a href="#produtos"><ShoppingBag /> Produtos</a>
        <button onClick={() => window.open(DISCORD_LINK, "_blank")}><MessageCircle /> Discord</button>
        <a href="#pagamento"><Wallet /> Pix</a>
        <button onClick={() => window.open(DISCORD_LINK, "_blank")}><ShieldCheck /> Suporte</button>

        <p className="menu-title">ADMINISTRAÇÃO</p>
        <button onClick={adminLogin}><ShieldCheck /> Painel Admin</button>
        <button onClick={adminLogin}><LogIn /> Login Admin</button>

        <p className="menu-title">CONTA</p>
        <button onClick={login}><LogIn /> Entrar</button>
        <button onClick={createAccount}><UserPlus /> Criar conta</button>

        <button className="discord-card" onClick={() => window.open(DISCORD_LINK, "_blank")}>
          <MessageCircle />
          <span>Acessar Discord</span>
          <small>Resgate seu pedido</small>
        </button>
      </aside>

      <main className="content">
        <section className="hero" id="inicio">
          <div className="hero-text">
            <span className="safe"><CheckCircle2 /> Compra 100% digital</span>
            <h1>Bem-vindo(a) à <b>Store Tauros</b></h1>
            <p>
              Produtos digitais para Discord com visual neon, pagamento via Pix,
              suporte no servidor e resgate direto após a compra.
            </p>

            <div className="features">
              <div><BadgeDollarSign /> Pix rápido</div>
              <div><ShieldCheck /> Compra segura</div>
              <div><MessageCircle /> Resgate no Discord</div>
            </div>
          </div>

          <div className="hero-logo">
            <div className="neon-bull">♉</div>
            <h2>TAUROS</h2>
            <p>STORE</p>
          </div>
        </section>

        <section className="welcome">
          <h2>Bem-vindo à Store Tauros</h2>
          <p>Escolha seu produto, pague via Pix e entre no Discord para resgatar seu pedido com a equipe.</p>
        </section>

        <section className="products" id="produtos">
          <div className="section-title">
            <h2>Nossos Produtos</h2>
            <p>Clique em um card para abrir a compra.</p>
          </div>

          <div className="grid">
            {productList.map((product) => {
              const Icon = product.icon;
              return (
                <article className="product-card" key={product.id} onClick={() => { setSelected(product); setQuantity(1); }}>
                  <img src={product.img} alt={product.title} />
                  <div className="product-body">
                    <Icon className="product-icon" />
                    <h3>{product.title}</h3>
                    <p>{product.desc}</p>
                    <strong>{currency(product.price)}</strong>
                    <button>Comprar <ExternalLink size={16} /></button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="payment" id="pagamento">
          <h2>Pagamento</h2>
          <div className="payment-box">
            <QrCode size={48} />
            <div>
              <h3>Apenas Pix</h3>
              <p>QR Code único e chave Pix configurados no painel admin.</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(pixKey).then(() => notify("Chave Pix copiada!"))}>
              <Copy /> Copiar Pix
            </button>
          </div>
        </section>

        <section className="orders">
          <h2>Meus pedidos</h2>
          {orders.length === 0 ? <p>Nenhum pedido ainda.</p> : orders.slice(0, 5).map((o) => (
            <div className="order" key={o.id}>
              <strong>{o.produto}</strong>
              <span>{o.quantidade}x • {o.total}</span>
              <small>{o.status}</small>
            </div>
          ))}
        </section>
      </main>

      {selected && (
        <div className="modal">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setSelected(null)}><X /></button>
            <img src={selected.img} alt={selected.title} />
            <h2>{selected.title}</h2>
            <p>{selected.desc}</p>

            <label>Quantidade</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />

            <div className="total">
              <span>Total</span>
              <strong>{currency(total)}</strong>
            </div>

            <div className="qr-area">
              {qrImage ? <img src={qrImage} alt="QR Code Pix" /> : <div className="fake-qr"><QrCode size={95} /><span>QR Pix</span></div>}
              <p>{pixKey}</p>
              <button onClick={() => navigator.clipboard.writeText(pixKey).then(() => notify("Chave Pix copiada!"))}>
                <Copy /> Copiar chave Pix
              </button>
            </div>

            <button className="finish" onClick={finishOrder}>
              Confirmar compra e ir para o Discord
            </button>
          </div>
        </div>
      )}

      {adminOpen && (
        <div className="modal">
          <div className="admin-modal">
            <button className="modal-close" onClick={() => setAdminOpen(false)}><X /></button>
            <h2>Painel Admin</h2>
            <p>Senha: admtauros</p>

            <label>Chave Pix única</label>
            <input value={pixKey} onChange={(e) => setPixKey(e.target.value)} />

            <button onClick={() => { localStorage.setItem("tauros_pix_key", pixKey); notify("Chave Pix salva!"); }}>
              <Save /> Salvar chave Pix
            </button>

            <label>Upload QR Code Pix</label>
            <input type="file" accept="image/*" onChange={handleQrUpload} />

            <div className="admin-actions">
              <button onClick={() => window.open(DISCORD_LINK, "_blank")}><MessageCircle /> Abrir Discord</button>
              <button onClick={clearSales}><Trash2 /> Limpar vendas</button>
            </div>

            <h3>Clientes</h3>
            <div className="admin-list">
              {clients.length === 0 ? <small>Nenhum cliente.</small> : clients.map((c, i) => <small key={i}>{c.name} • {c.email}</small>)}
            </div>

            <h3>Vendas</h3>
            <div className="admin-list">
              {orders.length === 0 ? <small>Nenhuma venda.</small> : orders.map((o) => <small key={o.id}>{o.produto} • {o.total} • {o.data}</small>)}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
