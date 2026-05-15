import { useEffect, useMemo, useState } from "react";
import {
  Home,
  ShoppingBag,
  ClipboardList,
  Headphones,
  UserPlus,
  LogIn,
  MessageCircle,
  ShieldCheck,
  Zap,
  Copy,
  X,
  Save,
  Upload,
  Trash2,
  Menu,
  ArrowRight,
  ShoppingCart,
  Lock,
  Users,
  Crown,
} from "lucide-react";

const DISCORD_LINK = "https://discord.gg/SXZCqeqMRM";
const ADMIN_PASSWORD = "admtauros";

const categories = [
  {
    id: "membros",
    title: "Membros Discord",
    subtitle: "Online, reais, premium e mistos",
    image: "/assets/membros-discord.png",
  },
  {
    id: "conta",
    title: "Conta Nitrada",
    subtitle: "Conta Discord com Nitro",
    image: "/assets/conta-nitrada.png",
  },
];

const products = [
  {
    id: "online",
    category: "membros",
    name: "Membros Online",
    desc: "100 membros online para servidores Discord",
    price: 10,
    image: "/assets/membros-discord.png",
    icon: Users,
  },
  {
    id: "reais",
    category: "membros",
    name: "Membros Reais",
    desc: "100 membros reais para servidores Discord",
    price: 5,
    image: "/assets/membros-discord.png",
    icon: Users,
  },
  {
    id: "premium",
    category: "membros",
    name: "Membros Premium",
    desc: "100 membros premium para servidores Discord",
    price: 6.5,
    image: "/assets/membros-discord.png",
    icon: Users,
  },
  {
    id: "mistos",
    category: "membros",
    name: "Membros Mistos",
    desc: "100 membros mistos para servidores Discord",
    price: 4,
    image: "/assets/membros-discord.png",
    icon: Users,
  },
  {
    id: "nitrada",
    category: "conta",
    name: "Conta Nitrada",
    desc: "Conta Discord nitrada com entrega digital",
    price: 6,
    image: "/assets/conta-nitrada.png",
    icon: Crown,
  },
];

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("tauros_user") || "null"));
  const [admin, setAdmin] = useState(false);
  const [pixKey, setPixKey] = useState(localStorage.getItem("tauros_pix_key") || "SUA-CHAVE-PIX-AQUI");
  const [qrImage, setQrImage] = useState(localStorage.getItem("tauros_qr") || "");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem("tauros_orders") || "[]"));
    setClients(JSON.parse(localStorage.getItem("tauros_clients") || "[]"));
  }, []);

  const visibleProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : [];

  const total = useMemo(() => {
    if (!selected) return 0;
    return selected.price * quantity;
  }, [selected, quantity]);

  function notify(text) {
    setToast(text);
    setTimeout(() => setToast(""), 2500);
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
    const contact = prompt("Digite seu Discord ou email:");
    if (!contact) return;

    const newUser = { name, contact, createdAt: new Date().toLocaleString("pt-BR") };
    setUser(newUser);
    localStorage.setItem("tauros_user", JSON.stringify(newUser));
    saveClients([newUser, ...clients]);
    notify("Conta criada com sucesso!");
  }

  function login() {
    const contact = prompt("Digite seu Discord ou email:");
    if (!contact) return;

    const found = clients.find((c) => c.contact === contact) || {
      name: "Cliente Tauros",
      contact,
      createdAt: new Date().toLocaleString("pt-BR"),
    };

    setUser(found);
    localStorage.setItem("tauros_user", JSON.stringify(found));
    notify("Login realizado!");
  }

  function adminLogin() {
    const pass = prompt("Digite a senha admin:");
    if (pass === ADMIN_PASSWORD) {
      setAdmin(true);
      notify("Painel admin aberto.");
    } else {
      notify("Senha incorreta.");
    }
  }

  function finishOrder() {
    const buyer = user || { name: "Cliente sem login", contact: "Não informado" };

    const order = {
      id: Date.now(),
      product: selected.name,
      quantity,
      total: money(total),
      client: buyer.name,
      contact: buyer.contact,
      date: new Date().toLocaleString("pt-BR"),
      status: "Resgatar pedido no Discord",
    };

    saveOrders([order, ...orders]);
    notify("Pedido feito! Abrindo Discord...");
    setSelected(null);
    setTimeout(() => window.open(DISCORD_LINK, "_blank"), 600);
  }

  function uploadQr(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setQrImage(reader.result);
      localStorage.setItem("tauros_qr", reader.result);
      notify("QR Code salvo no painel admin.");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="page">
      <div className="site-bg"></div>
      <button className="mobile-menu" onClick={() => setMenu(!menu)}><Menu /></button>

      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <div className="logo">
          <img src="/assets/banner-tauros.png" alt="Tauros" />
          <div>
            <h1>TAUROS</h1>
            <span>STORE</span>
          </div>
        </div>

        <nav>
          <a href="#inicio"><Home /> Início</a>
          <a href="#produtos"><ShoppingBag /> Produtos</a>
          <a href="#pedidos"><ClipboardList /> Meus Pedidos</a>
          <button onClick={() => window.open(DISCORD_LINK, "_blank")}><Headphones /> Suporte</button>

          <p>CONTA</p>
          <button onClick={login}><LogIn /> Entrar</button>
          <button onClick={createAccount}><UserPlus /> Criar Conta</button>

          <p>ADMIN</p>
          <button onClick={adminLogin}><Lock /> Painel Admin</button>
        </nav>

        <button className="discord-box" onClick={() => window.open(DISCORD_LINK, "_blank")}>
          <MessageCircle />
          <b>Entrar no Discord</b>
          <small>Resgate seu pedido</small>
          <ArrowRight />
        </button>
      </aside>

      <main className="content">
        <section className="hero" id="inicio">
          <div className="hero-left">
            <h2>Bem-vindo à</h2>
            <h1>Store Tauros!</h1>
            <p>Sua loja premium de produtos digitais para Discord. Compre, pague via Pix e resgate seu pedido diretamente no nosso servidor.</p>

            <div className="badges">
              <div><Zap /> Entrega rápida</div>
              <div><ShieldCheck /> 100% seguro</div>
              <div><Headphones /> Suporte 24/7</div>
            </div>
          </div>

          <div className="hero-banner">
            <img src="/assets/banner-tauros.png" alt="Banner Tauros" />
          </div>
        </section>

        <section className="categories" id="produtos">
          <div className="section-title">
            <h2>Nossos Produtos</h2>
            <p>Clique em uma pasta para abrir as opções de compra.</p>
          </div>

          {!activeCategory && (
            <div className="folder-grid">
              {categories.map((cat) => (
                <button className="folder-card" key={cat.id} onClick={() => setActiveCategory(cat.id)}>
                  <img src={cat.image} alt={cat.title} />
                  <div>
                    <h3>{cat.title}</h3>
                    <p>{cat.subtitle}</p>
                    <span>Acessar produtos <ArrowRight size={18} /></span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeCategory && (
            <>
              <button className="back-btn" onClick={() => setActiveCategory(null)}>← Voltar para pastas</button>

              <div className="product-grid">
                {visibleProducts.map((product) => {
                  const Icon = product.icon;
                  return (
                    <article className="product-card" key={product.id}>
                      <img src={product.image} alt={product.name} />
                      <div className="product-info">
                        <Icon />
                        <h3>{product.name}</h3>
                        <p>{product.desc}</p>
                        <strong>{money(product.price)}</strong>
                        <button onClick={() => { setSelected(product); setQuantity(1); }}>
                          <ShoppingCart size={18} /> Comprar agora
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <section className="payment">
          <h2>Pagamento</h2>
          <div className="payment-box">
            <Copy />
            <div>
              <h3>Apenas Pix</h3>
              <p>QR Code removido da página principal. Ele fica apenas no painel admin privado.</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(pixKey).then(() => notify("Chave Pix copiada!"))}>
              Copiar Pix
            </button>
          </div>
        </section>

        <section className="orders" id="pedidos">
          <h2>Meus pedidos</h2>
          {orders.length === 0 ? (
            <p>Nenhum pedido ainda.</p>
          ) : (
            orders.slice(0, 8).map((order) => (
              <div className="order" key={order.id}>
                <b>{order.product}</b>
                <span>{order.quantity}x • {order.total}</span>
                <small>{order.status}</small>
              </div>
            ))
          )}
        </section>
      </main>

      {selected && (
        <div className="modal">
          <div className="modal-card">
            <button className="close" onClick={() => setSelected(null)}><X /></button>
            <img src={selected.image} alt={selected.name} />
            <h2>{selected.name}</h2>
            <p>{selected.desc}</p>

            <label>Quantidade</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />

            <div className="total">
              <span>Total:</span>
              <b>{money(total)}</b>
            </div>

            <div className="pix-modal">
              <h3>Pagamento via Pix</h3>
              <p>{pixKey}</p>
              <button onClick={() => navigator.clipboard.writeText(pixKey).then(() => notify("Pix copiado!"))}>
                <Copy /> Copiar chave Pix
              </button>
            </div>

            <button className="finish" onClick={finishOrder}>
              Confirmar compra e ir para o Discord
            </button>
          </div>
        </div>
      )}

      {admin && (
        <div className="modal">
          <div className="admin-card">
            <button className="close" onClick={() => setAdmin(false)}><X /></button>
            <h2>Painel Admin Privado</h2>
            <p>Canal privado para Pix, QR Code, clientes e vendas.</p>

            <label>Chave Pix única</label>
            <input value={pixKey} onChange={(e) => setPixKey(e.target.value)} />
            <button onClick={() => { localStorage.setItem("tauros_pix_key", pixKey); notify("Chave Pix salva!"); }}>
              <Save /> Salvar Pix
            </button>

            <label>QR Code Pix privado</label>
            <input type="file" accept="image/*" onChange={uploadQr} />
            {qrImage && <img className="admin-qr" src={qrImage} alt="QR Pix privado" />}

            <div className="admin-actions">
              <button onClick={() => window.open(DISCORD_LINK, "_blank")}><MessageCircle /> Abrir Discord</button>
              <button onClick={() => { saveOrders([]); notify("Vendas limpas."); }}><Trash2 /> Limpar vendas</button>
            </div>

            <h3>Clientes</h3>
            <div className="admin-list">
              {clients.length === 0 ? <small>Nenhum cliente.</small> : clients.map((client, i) => (
                <small key={i}>{client.name} • {client.contact}</small>
              ))}
            </div>

            <h3>Vendas</h3>
            <div className="admin-list">
              {orders.length === 0 ? <small>Nenhuma venda.</small> : orders.map((order) => (
                <small key={order.id}>{order.product} • {order.total} • {order.date}</small>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
