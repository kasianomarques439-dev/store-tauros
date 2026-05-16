import { useEffect, useMemo, useState } from "react";
import { Home, ShoppingBag, ClipboardList, Headphones, UserPlus, LogIn, MessageCircle, ShieldCheck, Zap, Copy, X, Menu, ArrowRight, ShoppingCart, Lock, Users, Crown, QrCode, Download, RefreshCcw, Eye, Mail, KeyRound, Trash2 } from "lucide-react";
import { PIX_KEY_FIXA, QR_PIX_FIXO, DISCORD_LINK, ADMIN_PASSWORD, SUPABASE_URL, SUPABASE_KEY } from "./config.js";
import { supabase } from "./supabaseClient.js";

const products = [
  { id: "online", category: "membros", name: "Membros Online", desc: "100 membros online para servidores Discord", price: 10, image: "/assets/membros-discord.png", icon: Users },
  { id: "reais", category: "membros", name: "Membros Reais", desc: "100 membros reais para servidores Discord", price: 3.8, image: "/assets/membros-discord.png", icon: Users },
  { id: "premium", category: "membros", name: "Membros Premium", desc: "100 membros premium para servidores Discord", price: 6.5, image: "/assets/membros-discord.png", icon: Users },
  { id: "nitrada", category: "conta", name: "Conta Nitrada", desc: "Conta Discord nitrada com entrega digital", price: 6, image: "/assets/conta-nitrada.png", icon: Crown },
];

const categories = [
  { id: "membros", title: "Membros Discord", subtitle: "Online, reais e premium", image: "/assets/membros-discord.png" },
  { id: "conta", title: "Conta Nitrada", subtitle: "Conta Discord com Nitro", image: "/assets/conta-nitrada.png" },
];

function money(value) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getLocalClients() {
  try {
    return JSON.parse(localStorage.getItem("tauros_clients_backup") || "[]");
  } catch {
    return [];
  }
}

function saveLocalClients(clients) {
  localStorage.setItem("tauros_clients_backup", JSON.stringify(clients));
}

function getLocalOrders() {
  try {
    return JSON.parse(localStorage.getItem("tauros_orders_backup") || "[]");
  } catch {
    return [];
  }
}

function saveLocalOrders(orders) {
  localStorage.setItem("tauros_orders_backup", JSON.stringify(orders));
}

function normalizeClient(row) {
  return {
    id: row.id,
    discord: row.discord || row.name || "Cliente",
    email: row.email || row.contact || "",
    password: row.password || "",
    created_at: row.created_at || row.createdAt || "",
  };
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

function onlyLast24Hours(orders) {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  return orders.filter((order) => {
    const byId = Number(order.id);
    if (Number.isFinite(byId) && now - byId <= oneDay) return true;

    const parsedDate = Date.parse(String(order.date || "").replace(",", ""));
    if (Number.isFinite(parsedDate) && now - parsedDate <= oneDay) return true;

    return false;
  });
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
    const text = await response.text();
    throw new Error(text || `Erro REST ${response.status}`);
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
    const text = await response.text();
    throw new Error(text || `Erro REST ${response.status}`);
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
    const text = await response.text();
    throw new Error(text || `Erro REST ${response.status}`);
  }
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tauros_current_user") || "null"); } catch { return null; }
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

  useEffect(() => {
    pullSales(false);
    setOnlineCount(Math.floor(24 + Math.random() * 46));
    const timer = setInterval(() => setOnlineCount(Math.floor(24 + Math.random() * 46)), 9000);
    return () => clearInterval(timer);
  }, []);

  const visibleProducts = activeCategory ? products.filter((product) => product.category === activeCategory) : [];
  const total = useMemo(() => selected ? selected.price * quantity : 0, [selected, quantity]);

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

      if (error) {
        console.error("Erro Supabase cadastro:", error);

        const { data: existing } = await supabase
          .from("tauros_clients")
          .select("*")
          .eq("email", registerForm.email)
          .maybeSingle();

        if (existing) {
          const user = normalizeClient(existing);
          localStorage.setItem("tauros_current_user", JSON.stringify(user));
          setCurrentUser(user);
          notify("Conta encontrada. Login realizado!");
          return;
        }

        // Se for erro de duplicidade ou política, não trava a entrada.
        throw error;
      }

      localStorage.setItem("tauros_current_user", JSON.stringify(newClient));
      setCurrentUser(newClient);
      notify("Conta criada com sucesso!");
      return;
    } catch (error) {
      console.error("Falha ao conectar Supabase:", error);

      // Fallback para não travar o cliente caso a Vercel/Supabase bloqueie conexão.
      const localClients = getLocalClients();
      const exists = localClients.find((client) => client.email === newClient.email);

      if (!exists) {
        saveLocalClients([newClient, ...localClients]);
      }

      localStorage.setItem("tauros_current_user", JSON.stringify(newClient));
      setCurrentUser(newClient);
      notify("Conta criada. Modo local ativado.");
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

      if (!error && data) {
        const user = normalizeClient(data);
        localStorage.setItem("tauros_current_user", JSON.stringify(user));
        setCurrentUser(user);
        notify("Login realizado!");
        return;
      }
    } catch (error) {
      console.error("Falha no login Supabase:", error);
    }

    const localUser = getLocalClients().find(
      (client) => client.email === loginForm.email && client.password === loginForm.password
    );

    if (!localUser) {
      notify("Email ou senha incorretos.");
      return;
    }

    localStorage.setItem("tauros_current_user", JSON.stringify(localUser));
    setCurrentUser(localUser);
    notify("Login realizado!");
  }

  function logout() {
    localStorage.removeItem("tauros_current_user");
    setCurrentUser(null);
    setAuthMode("login");
  }

  function adminLogin() {
    const pass = prompt("Digite a senha admin:");
    if (pass === ADMIN_PASSWORD) {
      setAdmin(true);
      pullSales(false);
      notify("Painel admin aberto.");
    } else {
      notify("Senha incorreta.");
    }
  }

  async function finishOrder() {
    const order = {
      id: Date.now(),
      product: selected.name,
      quantity: Number(quantity),
      total: money(total),
      client: currentUser.discord || currentUser.name || "Cliente",
      contact: currentUser.email || currentUser.contact || "",
      date: new Date().toLocaleString("pt-BR"),
      status: "Compra confirmada pelo cliente",
    };

    const localOrders = getLocalOrders();
    if (!localOrders.some((item) => item.id === order.id)) {
      saveLocalOrders([order, ...localOrders]);
    }

    setOrders((old) => onlyLast24Hours([order, ...old.filter((item) => item.id !== order.id)]));

    const saleRecord = makeSaleClientRecord(order);
    let savedOnline = false;

    // Salva em tauros_orders usando Supabase SDK.
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

    // Salva também em tauros_clients como VENDA_CONFIRMADA para o painel admin puxar de qualquer aparelho.
    try {
      const { error } = await supabase.from("tauros_clients").insert([saleRecord]);
      if (error) throw error;
      savedOnline = true;
    } catch (error) {
      console.error("Erro SDK venda em clients:", error);
      try {
        await restInsert("tauros_clients", saleRecord);
        savedOnline = true;
      } catch (restError) {
        console.error("Erro REST venda em clients:", restError);
      }
    }

    notify(savedOnline ? "Compra confirmada!" : "Compra confirmada!");

    setSelected(null);
    setTimeout(() => window.open(DISCORD_LINK, "_blank"), 700);
  }

  async function pullSales(showMessage = true) {
    let onlineOrders = [];
    let onlineClients = [];
    let supabaseOk = false;

    try {
      const ordersResponse = await supabase
        .from("tauros_orders")
        .select("*")
        .order("id", { ascending: false });

      if (ordersResponse.error) throw ordersResponse.error;
      onlineOrders = ordersResponse.data || [];
      supabaseOk = true;
    } catch (error) {
      console.error("Erro SDK puxar tauros_orders:", error);
      try {
        onlineOrders = await restSelect("tauros_orders");
        supabaseOk = true;
      } catch (restError) {
        console.error("Erro REST puxar tauros_orders:", restError);
      }
    }

    try {
      const clientsResponse = await supabase
        .from("tauros_clients")
        .select("*")
        .order("id", { ascending: false });

      if (clientsResponse.error) throw clientsResponse.error;
      onlineClients = clientsResponse.data || [];
      supabaseOk = true;
    } catch (error) {
      console.error("Erro SDK puxar tauros_clients:", error);
      try {
        onlineClients = await restSelect("tauros_clients");
        supabaseOk = true;
      } catch (restError) {
        console.error("Erro REST puxar tauros_clients:", restError);
      }
    }

    const localOrders = getLocalOrders();
    const localClients = getLocalClients();

    const salesFromClients = onlineClients
      .map(saleFromClientRecord)
      .filter(Boolean);

    const orderMap = new Map();
    [...onlineOrders, ...salesFromClients, ...localOrders].forEach((order) => {
      if (order && order.id) orderMap.set(Number(order.id), order);
    });

    const clientMap = new Map();
    [...onlineClients.map(normalizeClient), ...localClients]
      .filter((client) => client.password !== "VENDA_CONFIRMADA")
      .forEach((client) => {
        if (client && client.email) clientMap.set(client.email, client);
      });

    const finalOrders = onlyLast24Hours(Array.from(orderMap.values()))
      .sort((a, b) => Number(b.id) - Number(a.id));
    const finalClients = Array.from(clientMap.values());

    setOrders(finalOrders);
    setClients(finalClients);
    saveLocalOrders(finalOrders);

    if (showMessage) {
      notify(finalOrders.length ? "Vendas atualizadas!" : "Nenhuma venda nas últimas 24h.");
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
    if (!confirm("Deseja limpar todas as vendas?")) return;

    try {
      const { error } = await supabase.from("tauros_orders").delete().neq("id", 0);
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao limpar tauros_orders:", error);
      try {
        await restDeleteOrders();
      } catch (restError) {
        console.error("Erro REST limpar vendas:", restError);
      }
    }

    try {
      await supabase.from("tauros_clients").delete().eq("password", "VENDA_CONFIRMADA");
    } catch (error) {
      console.error("Erro ao limpar vendas em clients:", error);
    }

    saveLocalOrders([]);
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
          <button onClick={adminLogin}><Lock /> Painel Admin</button>
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
              <div><Zap /> Entrega rápida</div><div><ShieldCheck /> 100% seguro</div><div><Headphones /> Suporte 24/7</div>
            </div>
          </div>
          <div className="hero-banner"><img src="/assets/topo-store-tauros.jpeg" alt="Banner Store Tauros" /></div>
        </section>
        <section className="categories" id="produtos">
          <div className="section-title"><h2>Nossos Produtos</h2><p>Clique em uma pasta para abrir as opções de compra.</p></div>
          {!activeCategory && (
            <div className="folder-grid">
              {categories.map((cat) => (
                <button className="folder-card" key={cat.id} onClick={() => setActiveCategory(cat.id)}>
                  <img src={cat.image} alt={cat.title} />
                  <div><h3>{cat.title}</h3><p>{cat.subtitle}</p><span>Acessar produtos <ArrowRight size={18} /></span></div>
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
                        <Icon /><h3>{product.name}</h3><p>{product.desc}</p><strong>{money(product.price)}</strong>
                        <button onClick={() => { setSelected(product); setQuantity(1); }}><ShoppingCart size={18} /> Comprar agora</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
        <section className="orders" id="pedidos">
          <h2>Meus pedidos</h2>
          {orders.filter((order) => order.contact === currentUser.email).length === 0 ? <p>Nenhum pedido ainda.</p> : orders.filter((order) => order.contact === currentUser.email).map((order) => (
            <div className="order" key={order.id}><b>{order.product}</b><span>{order.quantity}x • {order.total}</span><small>{order.status}</small></div>
          ))}
        </section>
      </main>
      {selected && (
        <div className="modal">
          <div className="modal-card">
            <button className="close" onClick={() => setSelected(null)}><X /></button>
            <img src={selected.image} alt={selected.name} />
            <h2>{selected.name}</h2><p>{selected.desc}</p>
            <label>Quantidade</label>
            <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} />
            <div className="total"><span>Total:</span><b>{money(total)}</b></div>
            <div className="pix-modal">
              <h3><QrCode /> Pagamento via Pix</h3>
              <img className="qr-public" src={QR_PIX_FIXO} alt="QR Code Pix" />
              <p className="pix-key">{PIX_KEY_FIXA}</p>
              <button onClick={() => navigator.clipboard.writeText(PIX_KEY_FIXA).then(() => notify("Chave Pix copiada!"))}><Copy /> Copiar chave Pix</button>
            </div>
            <button className="finish" onClick={finishOrder}>Confirmar compra e ir para o Discord</button>
          </div>
        </div>
      )}
      {admin && (
        <div className="modal">
          <div className="admin-card">
            <button className="close" onClick={() => setAdmin(false)}><X /></button>
            <h2>Painel Admin Privado</h2><p>Compras e clientes são puxados do Supabase online.</p><p>Pix fixo: <b>{PIX_KEY_FIXA}</b></p>
            <img className="admin-qr" src={QR_PIX_FIXO} alt="QR Pix" />
            <div className="admin-actions">
              <button onClick={() => pullSales(true)}><RefreshCcw /> Puxar compras</button>
              <button onClick={downloadSales}><Download /> Baixar vendas</button>
              <button onClick={() => window.open(DISCORD_LINK, "_blank")}><MessageCircle /> Abrir Discord</button>
              <button onClick={clearOrders}><Trash2 /> Limpar vendas</button>
            </div>
            <h3>Clientes</h3>
            <div className="admin-list">{clients.length === 0 ? <small>Nenhum cliente.</small> : clients.map((client) => <small key={client.id}>{client.discord} • {client.email} • {client.created_at}</small>)}</div>
            <h3>Vendas confirmadas</h3>
            <div className="admin-list">
              {orders.length === 0 ? (
                <small>Nenhuma venda confirmada ainda.</small>
              ) : (
                orders.map((order) => (
                  <div className="sale-row" key={order.id}>
                    <b>{order.product}</b>
                    <span>Cliente: {order.client || "Não informado"}</span>
                    <span>Email/contato: {order.contact || "Não informado"}</span>
                    <span>Quantidade: {order.quantity} • Total: {order.total}</span>
                    <small>{order.status || "Compra confirmada"} • {order.date}</small>
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
