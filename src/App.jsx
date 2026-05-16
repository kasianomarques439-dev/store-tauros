import { useEffect, useMemo, useState } from "react";
import {
  Home, ShoppingBag, ClipboardList, Headphones, UserPlus, LogIn, MessageCircle,
  ShieldCheck, Zap, Copy, X, Menu, ArrowRight, ShoppingCart, Lock, Users,
  Crown, QrCode, Download, RefreshCcw, Eye, Mail, KeyRound, Trash2, Wand2, Sparkles, Star, Bell, Ticket, Bot, TimerReset, Percent, Search, Filter
} from "lucide-react";
import { PIX_KEY_FIXA, QR_PIX_FIXO, DISCORD_LINK, ADMIN_PASSWORD, SUPABASE_URL, SUPABASE_KEY } from "./config.js";
import { supabase } from "./supabaseClient.js";

const SUPPORT_PASSWORD = "sptauros";
const ADM_PASSWORD = "stadm";

const products = [
  { id: "online", category: "membros", name: "Membros Online", desc: "100 membros online para servidores Discord", price: 10, image: "/assets/membros-discord.png", icon: Users },
  { id: "reais", category: "membros", name: "Membros Reais", desc: "100 membros reais para servidores Discord", price: 3.8, image: "/assets/membros-discord.png", icon: Users },
  { id: "premium", category: "membros", name: "Membros Premium", desc: "100 membros premium para servidores Discord", price: 6.5, image: "/assets/membros-discord.png", icon: Users },
  { id: "conta-nitrada-1m", category: "conta", name: "Conta Nitrada 1 Mês", desc: "Conta Discord nitrada com entrega digital", price: 6, image: "/assets/conta-nitrada.png", icon: Crown },
  { id: "conta-nitrada-3m", category: "conta", name: "Conta Trimestral", desc: "Conta Discord nitrada por 3 meses", price: 16.99, image: "/assets/conta-nitrada.png", icon: Crown },
  { id: "nitro-link-1m", category: "nitro-link", name: "Nitro Link 1 Mês", desc: "Nitro Link para ativar na sua conta", price: 1.99, image: "/assets/nitro-link-produto.png", icon: Crown },
  { id: "nitro-link-3m", category: "nitro-link", name: "Nitro Link 3 Meses", desc: "Nitro Link trimestral para sua conta", price: 8.99, image: "/assets/nitro-link-produto.png", icon: Crown },
  { id: "ativacao-link", category: "ativacao-link", name: "Ativação Link", desc: "Ativação segura de Nitro Link na sua conta", price: 2, image: "/assets/nitro-link-produto.png", icon: Crown },
  { id: "design-servidor", category: "servicos", name: "Design de Servidor", desc: "Organização, cargos, canais e visual completo", price: 50, image: "/assets/topo-store-tauros.jpeg", icon: Wand2 },
  { id: "impulsos-2x", category: "impulsos", name: "Impulsos 2x", desc: "2 impulsos para seu servidor Discord", price: 3.5, image: "/assets/membros-discord.png", icon: Sparkles },
  { id: "impulsos-4x", category: "impulsos", name: "Impulsos 4x", desc: "4 impulsos para seu servidor Discord", price: 7, image: "/assets/membros-discord.png", icon: Sparkles },
  { id: "impulsos-8x", category: "impulsos", name: "Impulsos 8x", desc: "8 impulsos para seu servidor Discord", price: 10.5, image: "/assets/membros-discord.png", icon: Sparkles },
  { id: "impulsos-14x", category: "impulsos", name: "Impulsos 14x", desc: "14 impulsos para seu servidor Discord", price: 21.99, image: "/assets/membros-discord.png", icon: Sparkles },
];

const categories = [
  { id: "membros", title: "Membros Discord", subtitle: "Online, reais e premium", image: "/assets/membros-discord.png" },
  { id: "conta", title: "Contas Nitradas", subtitle: "Conta 1 mês e trimestral", image: "/assets/conta-nitrada.png" },
  { id: "nitro-link", title: "Nitro Link", subtitle: "Link de 1 mês e 3 meses", image: "/assets/nitro-link-produto.png" },
  { id: "ativacao-link", title: "Ativação Link", subtitle: "Ativação do link na sua conta", image: "/assets/nitro-link-produto.png" },
  { id: "servicos", title: "Design de Servidor", subtitle: "Servidor completo por R$50", image: "/assets/topo-store-tauros.jpeg" },
  { id: "impulsos", title: "Impulsos Discord", subtitle: "2x, 4x, 8x e 14x", image: "/assets/membros-discord.png" },
];

const coupons = { TAUROS10: 0.10, VIP5: 0.05 };

function money(value) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizeClient(row) {
  return {
    id: row.id,
    discord: row.discord || "Cliente",
    email: row.email || "",
    password: row.password || "",
    created_at: row.created_at || "",
  };
}

function onlyLast24Hours(orders) {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  return orders.filter((order) => {
    const idTime = Number(order.id);
    if (!Number.isFinite(idTime)) return true;
    return now - idTime <= oneDay;
  });
}

function makeSaleClientRecord(order) {
  return {
    id: Number(order.id),
    discord: `VENDA_CONFIRMADA | ${order.client || "Cliente"} | ${order.product || "Produto"} | ${order.quantity || 1}x | ${order.total || ""}`,
    email: `venda-${order.id}@storetauros.local`,
    password: "VENDA_CONFIRMADA",
    created_at: order.date || new Date().toLocaleString("pt-BR"),
  };
}

function saleFromClientRecord(client) {
  if (!client || client.password !== "VENDA_CONFIRMADA") return null;

  const parts = String(client.discord || "").split("|").map((item) => item.trim());

  return {
    id: client.id,
    product: parts[2] || "Produto",
    quantity: parts[3]?.replace("x", "") || "1",
    total: parts[4] || "",
    client: parts[1] || "Cliente",
    contact: client.email || "",
    date: client.created_at || "",
    status: "Compra confirmada pelo cliente",
  };
}

async function restInsert(table, payload) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

async function restSelect(table) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=id.desc`, {
    method: "GET",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

async function restDeleteOrders() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tauros_orders?id=neq.0`, {
    method: "DELETE",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal",
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotCode, setForgotCode] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [typedCode, setTypedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tauros_current_user") || "null");
    } catch {
      return null;
    }
  });

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ discord: "", email: "", password: "" });
  const [activeCategory, setActiveCategory] = useState(null);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [toast, setToast] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const [loadingSales, setLoadingSales] = useState(false);
  const [adminRole, setAdminRole] = useState("");
  const [adminFilter, setAdminFilter] = useState("24h");
  const [searchTerm, setSearchTerm] = useState("");
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    pullSales(false);
    setOnlineCount(Math.floor(24 + Math.random() * 46));
    const timer = setInterval(() => setOnlineCount(Math.floor(24 + Math.random() * 46)), 9000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!admin) return;
    const timer = setInterval(() => pullSales(false), 15000);
    return () => clearInterval(timer);
  }, [admin]);

  const visibleProducts = activeCategory ? products.filter((product) => product.category === activeCategory) : [];
  const subtotal = useMemo(() => selected ? selected.price * quantity : 0, [selected, quantity]);
  const couponDiscount = coupons[coupon.trim().toUpperCase()] || 0;
  const total = subtotal * (1 - couponDiscount);
  const filteredOrders = orders.filter((order) => `${order.client} ${order.contact} ${order.product} ${order.status}`.toLowerCase().includes(searchTerm.toLowerCase()));

  function notify(message) {
    setToast(message);
    setTimeout(() => setToast(""), 3500);
  }

  async function register(event) {
    event.preventDefault();

    if (!registerForm.discord || !registerForm.email || !registerForm.password) {
      notify("Preencha todos os campos.");
      return;
    }

    const newClient = {
      id: Date.now(),
      discord: registerForm.discord,
      email: registerForm.email,
      password: registerForm.password,
      created_at: new Date().toLocaleString("pt-BR"),
    };

    try {
      const { error } = await supabase.from("tauros_clients").insert([newClient]);
      if (error) throw error;
      localStorage.setItem("tauros_current_user", JSON.stringify(newClient));
      setCurrentUser(newClient);
      notify("Conta criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      notify("Erro ao criar conta. Verifique o Supabase.");
    }
  }

  async function login(event) {
    event.preventDefault();

    try {
      const { data, error } = await supabase
        .from("tauros_clients")
        .select("*")
        .eq("email", loginForm.email)
        .eq("password", loginForm.password)
        .maybeSingle();

      if (error || !data) {
        notify("Email ou senha incorretos.");
        return;
      }

      const user = normalizeClient(data);
      localStorage.setItem("tauros_current_user", JSON.stringify(user));
      setCurrentUser(user);
      notify("Login realizado!");
    } catch (error) {
      console.error("Erro no login:", error);
      notify("Erro no login. Verifique o Supabase.");
    }
  }

  function logout() {
    localStorage.removeItem("tauros_current_user");
    setCurrentUser(null);
    setAuthMode("login");
  }

  function adminLogin(role = "admin") {
    const pass = prompt(role === "support" ? "Digite a senha do suporte:" : "Digite a senha ADM:");
    const ok = role === "support" ? pass === SUPPORT_PASSWORD : pass === ADM_PASSWORD;

    if (ok) {
      setAdmin(true);
      setAdminRole(role);
      pullSales(false);
      notify(role === "support" ? "Painel suporte aberto." : "Painel ADM aberto.");
    } else {
      notify("Senha incorreta.");
    }
  }

  async function forgotPassword() {
    const email = prompt("Digite o email da sua conta:");
    if (!email) return;

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setForgotEmail(email);
    setForgotCode(code);
    setForgotOpen(true);
    notify(`Código gerado: ${code}`);
  }

  async function resetPassword(event) {
    event.preventDefault();

    if (typedCode !== forgotCode) {
      notify("Código incorreto.");
      return;
    }

    if (!newPassword) {
      notify("Digite a nova senha.");
      return;
    }

    try {
      const { error } = await supabase.from("tauros_clients").update({ password: newPassword }).eq("email", forgotEmail);
      if (error) throw error;
      notify("Senha alterada!");
      setForgotOpen(false);
      setTypedCode("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      notify("Erro ao alterar senha.");
    }
  }

  async function updateOrderStatus(order, status) {
    setOrders((old) => old.map((item) => item.id === order.id ? { ...item, status } : item));
    try {
      await supabase.from("tauros_orders").update({ status }).eq("id", order.id);
      notify("Status atualizado.");
    } catch {
      notify("Status alterado na tela.");
    }
  }

  async function finishOrder() {
    const order = {
      id: Date.now(),
      product: selected.name,
      quantity: Number(quantity),
      total: money(total),
      client: currentUser.discord || "Cliente",
      contact: currentUser.email || "",
      date: new Date().toLocaleString("pt-BR"),
      status: "Compra confirmada pelo cliente",
    };

    const saleRecord = makeSaleClientRecord(order);
    let savedOnline = false;

    try {
      const { error } = await supabase.from("tauros_orders").insert([order]);
      if (error) throw error;
      savedOnline = true;
    } catch (error) {
      console.error("Erro SDK tauros_orders:", error);
      try {
        await restInsert("tauros_orders", order);
        savedOnline = true;
      } catch (restError) {
        console.error("Erro REST tauros_orders:", restError);
      }
    }

    try {
      const { error } = await supabase.from("tauros_clients").insert([saleRecord]);
      if (error) throw error;
      savedOnline = true;
    } catch (error) {
      console.error("Erro SDK venda em clientes:", error);
      try {
        await restInsert("tauros_clients", saleRecord);
        savedOnline = true;
      } catch (restError) {
        console.error("Erro REST venda em clientes:", restError);
      }
    }

    if (!savedOnline) {
      notify("Erro ao enviar compra para o servidor. Tente novamente.");
      return;
    }

    setOrders((old) => onlyLast24Hours([order, ...old.filter((item) => item.id !== order.id)]));
    notify("Compra confirmada!");
    setSelected(null);
    setTimeout(() => window.open(DISCORD_LINK, "_blank"), 700);
  }

  async function pullSales(showMessage = true) {
    setLoadingSales(true);

    try {
      let onlineOrders = [];
      let onlineClients = [];

      try {
        const ordersResponse = await supabase
          .from("tauros_orders")
          .select("*")
          .order("id", { ascending: false });

        if (ordersResponse.error) throw ordersResponse.error;
        onlineOrders = ordersResponse.data || [];
      } catch (error) {
        console.error("Erro SDK puxar orders:", error);
        onlineOrders = await restSelect("tauros_orders");
      }

      try {
        const clientsResponse = await supabase
          .from("tauros_clients")
          .select("*")
          .order("id", { ascending: false });

        if (clientsResponse.error) throw clientsResponse.error;
        onlineClients = clientsResponse.data || [];
      } catch (error) {
        console.error("Erro SDK puxar clients:", error);
        onlineClients = await restSelect("tauros_clients");
      }

      const salesFromClients = onlineClients.map(saleFromClientRecord).filter(Boolean);
      const orderMap = new Map();

      [...onlineOrders, ...salesFromClients].forEach((order) => {
        if (order && order.id) orderMap.set(Number(order.id), order);
      });

      const finalOrders = onlyLast24Hours(Array.from(orderMap.values()))
        .sort((a, b) => Number(b.id) - Number(a.id));

      const finalClients = onlineClients
        .map(normalizeClient)
        .filter((client) => client.password !== "VENDA_CONFIRMADA");

      setOrders(finalOrders);
      setClients(finalClients);

      if (showMessage) {
        notify(finalOrders.length ? "Vendas atualizadas!" : "Nenhuma venda nas últimas 24h.");
      }
    } catch (error) {
      console.error("Erro ao puxar vendas:", error);
      if (showMessage) notify("Erro ao atualizar vendas. Confira Supabase URL/KEY e SQL.");
    } finally {
      setLoadingSales(false);
    }
  }

  function downloadSales() {
    const data = orders.map((order) =>
      `${order.id};${order.date};${order.client};${order.contact};${order.product};${order.quantity};${order.total};${order.status}`
    ).join("\n");

    const csv = "ID;Data;Cliente;Contato;Produto;Quantidade;Total;Status\n" + data;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = url;
    element.download = "vendas-store-tauros.csv";
    element.click();
    URL.revokeObjectURL(url);
  }

  async function clearOrders() {
    if (adminRole !== "admin") { notify("Somente ADM pode limpar vendas."); return; }
    if (!confirm("Deseja limpar todas as vendas?")) return;

    try {
      const { error } = await supabase.from("tauros_orders").delete().neq("id", 0);
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao limpar orders:", error);
      try {
        await restDeleteOrders();
      } catch (restError) {
        console.error("Erro REST limpar orders:", restError);
      }
    }

    try {
      await supabase.from("tauros_clients").delete().eq("password", "VENDA_CONFIRMADA");
    } catch (error) {
      console.error("Erro ao limpar vendas em clients:", error);
    }

    setOrders([]);
    notify("Vendas limpas.");
  }

  if (!currentUser) {
    return (
      <div className="auth-page">
        <div className="auth-bg"></div>

        <div className="auth-card">
          <img src="/assets/topo-store-tauros.jpeg" alt="Store Tauros" className="auth-banner" />
          <h1>Store Tauros</h1>
          <p>Acesso exclusivo. Entre ou crie sua conta para acessar a loja.</p>

          <div className="auth-tabs">
            <button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>Entrar</button>
            <button className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>Criar conta</button>
          </div>

          {authMode === "login" ? (
            <form onSubmit={login} className="auth-form">
              <label><Mail size={18} /> Email</label>
              <input type="email" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} placeholder="seuemail@gmail.com" />

              <label><KeyRound size={18} /> Senha</label>
              <input type="password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} placeholder="Sua senha" />

              <button type="submit"><LogIn /> Entrar no site</button>
              <span onClick={() => setAuthMode("register")}>Ainda não tem conta? Criar conta</span>
              <span onClick={forgotPassword}>Esqueci minha senha</span>
            </form>
          ) : (
            <form onSubmit={register} className="auth-form">
              <label><MessageCircle size={18} /> Nome do Discord</label>
              <input value={registerForm.discord} onChange={(event) => setRegisterForm({ ...registerForm, discord: event.target.value })} placeholder="Seu nome no Discord" />

              <label><Mail size={18} /> Email</label>
              <input type="email" value={registerForm.email} onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })} placeholder="seuemail@gmail.com" />

              <label><KeyRound size={18} /> Senha</label>
              <input type="password" value={registerForm.password} onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })} placeholder="Crie uma senha" />

              <button type="submit"><UserPlus /> Criar conta e acessar</button>
              <span onClick={() => setAuthMode("login")}>Já tenho conta. Entrar</span>
            </form>
          )}
        </div>

        
        {forgotOpen && (
          <div className="modal">
            <div className="modal-card">
              <button className="close" onClick={() => setForgotOpen(false)}><X /></button>
              <h2>Recuperar senha</h2>
              <p>Código gerado para recuperação: <b>{forgotCode}</b></p>
              <form onSubmit={resetPassword} className="auth-form recovery-box">
                <label><KeyRound size={18} /> Código</label>
                <input value={typedCode} onChange={(event) => setTypedCode(event.target.value)} placeholder="Digite o código" />
                <label><Lock size={18} /> Nova senha</label>
                <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Nova senha" />
                <button type="submit"><Lock /> Alterar senha</button>
              </form>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="site-bg"></div>
      <button className="mobile-menu" onClick={() => setMenu(!menu)}><Menu /></button>

      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <div className="logo">
          <img src="/assets/topo-store-tauros.jpeg" alt="Tauros" />
          <div><h1>TAUROS</h1><span>STORE</span></div>
        </div>

        <nav>
          <a href="#inicio"><Home /> Início</a>
          <a href="#produtos"><ShoppingBag /> Produtos</a>
          <a href="#pedidos"><ClipboardList /> Meus Pedidos</a>
          <button onClick={() => window.open(DISCORD_LINK, "_blank")}><Headphones /> Suporte</button>
          <p>CONTA</p>
          <button onClick={logout}><LogIn /> Sair</button>
          <p>ADMIN</p>
          <button onClick={() => adminLogin("support")}><Headphones /> Login Suporte</button>
          <button onClick={() => adminLogin("admin")}><Lock /> Login ADM</button>
        </nav>

        <button className="discord-box" onClick={() => window.open(DISCORD_LINK, "_blank")}>
          <MessageCircle /><b>Entrar no Discord</b><small>Resgate seu pedido</small><ArrowRight />
        </button>
      </aside>

      <main className="content">
        <section className="hero" id="inicio">
          <div className="hero-left">
            <div className="online-pill"><Eye size={18} /> {onlineCount} online no site</div>
            <h2>Bem-vindo, {currentUser.discord}</h2>
            <h1>Store Tauros!</h1>
            <p>Sua loja premium de produtos digitais para Discord. Compre, pague via Pix e resgate seu pedido diretamente no nosso servidor.</p>

            <div className="badges">
              <div><Zap /> Entrega rápida</div>
              <div><ShieldCheck /> 100% seguro</div>
              <div><Headphones /> Suporte 24/7</div>
            </div>
          </div>

          <div className="hero-banner"><img src="/assets/topo-store-tauros.jpeg" alt="Banner Store Tauros" /></div>
        </section>

        <section className="live-sales">
          <h2><Bell /> Últimas compras realizadas</h2>
          <div className="live-grid">
            <span>João comprou Nitro Link 1 Mês</span>
            <span>Pedro comprou Membros Premium</span>
            <span>Lucas comprou Conta Trimestral</span>
            <span>Rafa comprou Design de Servidor</span>
          </div>
        </section>

        <section className="features">
          <div><Ticket /><h3>Cupom ativo</h3><p>Use TAUROS10 ou VIP5 no pagamento.</p></div>
          <div><Bot /><h3>Ticket automático</h3><p>Após pagar, o cliente vai direto para o Discord.</p></div>
          <div><TimerReset /><h3>Status do pedido</h3><p>Pendente, Pago, Em entrega e Finalizado.</p></div>
          <div><Bell /><h3>Atualização automática</h3><p>Painel atualiza a cada 15 segundos.</p></div>
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

        
        <section className="reviews" id="avaliacoes">
          <h2>Avaliações dos clientes</h2>
          <div className="review-grid">
            <div><b>★★★★★</b><p>Entrega rápida e suporte muito bom.</p><small>— Cliente Store Tauros</small></div>
            <div><b>★★★★★</b><p>Comprei membros e chegou certinho.</p><small>— Cliente Discord</small></div>
            <div><b>★★★★★</b><p>Design bonito e preço bom.</p><small>— Cliente Premium</small></div>
          </div>
        </section>

        <section className="orders" id="pedidos">
          <h2>Meus pedidos</h2>
          {orders.filter((order) => order.contact === currentUser.email).length === 0 ? (
            <p>Nenhum pedido ainda.</p>
          ) : (
            orders.filter((order) => order.contact === currentUser.email).map((order) => (
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
            <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} />

            <label><Percent size={18} /> Cupom</label>
            <input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="TAUROS10 ou VIP5" />
            <div className="total"><span>Total:</span><b>{money(total)}</b></div>
            {couponDiscount > 0 && <p className="discount-msg">Desconto aplicado!</p>}

            <div className="pix-modal">
              <h3><QrCode /> Pagamento via Pix</h3>
              <img className="qr-public" src={QR_PIX_FIXO} alt="QR Code Pix" />
              <p className="pix-key">{PIX_KEY_FIXA}</p>
              <button onClick={() => navigator.clipboard.writeText(PIX_KEY_FIXA).then(() => notify("Chave Pix copiada!"))}>
                <Copy /> Copiar chave Pix
              </button>
            </div>

            <button className="finish" onClick={finishOrder}>Confirmar compra e ir para o Discord</button>
          </div>
        </div>
      )}

      {admin && (
        <div className="modal">
          <div className="admin-card">
            <button className="close" onClick={() => setAdmin(false)}><X /></button>
            <h2>{adminRole === "admin" ? "Painel ADM" : "Painel Suporte"}</h2>
            <p>Compras confirmadas das últimas 24h aparecem aqui.</p>
            <p>Pix fixo: <b>{PIX_KEY_FIXA}</b></p>
            <img className="admin-qr" src={QR_PIX_FIXO} alt="QR Pix" />

            <div className="admin-tools">
              <label><Filter size={16} /> Filtro</label>
              <select value={adminFilter} onChange={(event) => setAdminFilter(event.target.value)}>
                <option value="24h">Últimas 24h</option>
                <option value="all">Todas</option>
              </select>
              <label><Search size={16} /> Buscar</label>
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="cliente, email ou produto" />
            </div>

            <div className="admin-actions">
              <button onClick={() => pullSales(true)} disabled={loadingSales}>
                <RefreshCcw /> {loadingSales ? "Atualizando..." : "Puxar compras"}
              </button>
              <button onClick={downloadSales}><Download /> Baixar vendas</button>
              <button onClick={() => window.open(DISCORD_LINK, "_blank")}><MessageCircle /> Abrir Discord</button>
              <button onClick={clearOrders}><Trash2 /> Limpar vendas</button>
            </div>

            <h3>Clientes</h3>
            <div className="admin-list">
              {clients.length === 0 ? (
                <small>Nenhum cliente.</small>
              ) : (
                clients.map((client) => <small key={client.id}>{client.discord} • {client.email} • {client.created_at}</small>)
              )}
            </div>

            <h3>Vendas confirmadas</h3>
            <div className="admin-list">
              {filteredOrders.length === 0 ? (
                <small>Nenhuma venda confirmada.</small>
              ) : (
                filteredOrders.map((order) => (
                  <div className="sale-row" key={order.id}>
                    <b>{order.product}</b>
                    <span>Cliente: {order.client || "Não informado"}</span>
                    <span>Email/contato: {order.contact || "Não informado"}</span>
                    <span>Quantidade: {order.quantity} • Total: {order.total}</span>
                    <small>Status: {order.status || "Pendente"} • {order.date}</small>
                    {adminRole === "admin" && (
                      <div className="status-actions">
                        <button onClick={() => updateOrderStatus(order, "Pago")}>Pago</button>
                        <button onClick={() => updateOrderStatus(order, "Em entrega")}>Em entrega</button>
                        <button onClick={() => updateOrderStatus(order, "Finalizado")}>Finalizado</button>
                      </div>
                    )
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
