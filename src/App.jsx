
import React, { useMemo, useState } from "react";
import { supabase, usingSupabase } from "./supabaseClient.js";

const DISCORD = "https://discord.gg/WPH5Xc58cm";
const ADMIN_PASS = "admtauros";

const prices = { mistos: 4, reais: 5, premium: 9 };
const qtys = [100, 200, 300, 400, 5000];

const homeCards = [
  { key: "discord", title: "Discord", desc: "Veja nossos produtos", icon: "💬" },
  { key: "membros", title: "Membros Discord", desc: "Servidores com membros", icon: "👥" },
  { key: "nitro", title: "Nitro Discord", desc: "Nitro para sua conta", icon: "💎" },
  { key: "designer", title: "Designer", desc: "Designer para seu servidor", icon: "🎨" }
];

const catalog = {
  discord: [
    { id: "mistos", name: "Membros Mistos", type: "members", unit: 4, icon: "👥", desc: "Membros mistos para movimentar seu servidor." },
    { id: "reais", name: "Membros Reais", type: "members", unit: 5, icon: "🧑‍🤝‍🧑", desc: "Membros reais para fortalecer sua comunidade." },
    { id: "premium", name: "Membros Premium", type: "members", unit: 9, icon: "👑", desc: "Membros premium com mais qualidade." },
    { id: "nitro", name: "Nitro Discord", type: "fixed", price: 6.5, icon: "💎", desc: "Conta/Nitro com resgate via ticket." },
    { id: "designer", name: "Designer de Server", type: "fixed", price: 65, icon: "🎨", desc: "Design completo para seu servidor." }
  ],
  membros: [
    { id: "mistos", name: "Membros Mistos", type: "members", unit: 4, icon: "👥", desc: "R$4 a cada 100 membros." },
    { id: "reais", name: "Membros Reais", type: "members", unit: 5, icon: "🧑‍🤝‍🧑", desc: "R$5 a cada 100 membros." },
    { id: "premium", name: "Membros Premium", type: "members", unit: 9, icon: "👑", desc: "R$9 a cada 100 membros." }
  ],
  nitro: [{ id: "nitro", name: "Nitro Discord", type: "fixed", price: 6.5, icon: "💎", desc: "Nitro/Conta Nitrada por R$6,50." }],
  designer: [{ id: "designer", name: "Designer de Server", type: "fixed", price: 65, icon: "🎨", desc: "Designer completo por R$65,00." }]
};

function money(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}

export default function App() {
  const [openCatalog, setOpenCatalog] = useState(null);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(100);
  const [paid, setPaid] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [notification, setNotification] = useState("");

  const [authMode, setAuthMode] = useState(null);
  const [email, setEmail] = useState(localStorage.getItem("st_email") || "");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(load("st_current_user", null));
  const [users, setUsers] = useState(load("st_users", []));

  const [adminLogin, setAdminLogin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [pix, setPix] = useState(localStorage.getItem("st_pix") || "");
  const [qr, setQr] = useState(localStorage.getItem("st_qr") || "");
  const [pixAuto, setPixAuto] = useState(localStorage.getItem("st_pix_auto") || "simulado");
  const [orders, setOrders] = useState(load("st_orders", []));

  const finalPrice = useMemo(() => {
    if (!selected) return "";
    if (selected.type === "members") return money((qty / 100) * selected.unit);
    return money(selected.price);
  }, [selected, qty]);

  function notify(text) {
    setNotification(text);
    setTimeout(() => setNotification(""), 4200);
  }

  async function authUser(create = false) {
    if (!email.includes("@")) return alert("Digite um email válido.");
    if (!password) return alert("Digite uma senha.");

    if (usingSupabase) {
      const action = create
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
      if (action.error) return alert(action.error.message);
    }

    const user = { email, createdAt: new Date().toLocaleString("pt-BR") };
    const existing = users.find((u) => u.email === email);
    const updatedUsers = existing ? users : [user, ...users];
    setUsers(updatedUsers);
    setCurrentUser(user);
    localStorage.setItem("st_users", JSON.stringify(updatedUsers));
    localStorage.setItem("st_current_user", JSON.stringify(user));
    localStorage.setItem("st_email", email);
    setAuthMode(null);
    notify(create ? "Conta criada com sucesso!" : "Login realizado com sucesso!");
  }

  function logout() {
    localStorage.removeItem("st_current_user");
    setCurrentUser(null);
    notify("Você saiu da conta.");
  }

  function loginAdmin() {
    if (adminPass === ADMIN_PASS) {
      setAdminLogin(false);
      setAdminOpen(true);
      setAdminPass("");
    } else alert("Senha incorreta.");
  }

  function saveAdmin() {
    localStorage.setItem("st_pix", pix);
    localStorage.setItem("st_qr", qr);
    localStorage.setItem("st_pix_auto", pixAuto);
    notify("Configurações do admin salvas!");
  }

  function uploadQr(e) {
    const file = e.target.files?.[0];
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

  function openCard(key) {
    setOpenCatalog({ title: key === "discord" ? "Discord" : key === "membros" ? "Membros Discord" : key === "nitro" ? "Nitro Discord" : "Designer", items: catalog[key] });
    setMobile(false);
  }

  function buyItem(item) {
    setSelected(item);
    setQty(100);
    setPaid(false);
    setOpenCatalog(null);
  }

  function confirmPayment() {
    if (!selected) return;
    const order = {
      id: "ST-" + Math.floor(1000 + Math.random() * 9000),
      user: currentUser?.email || "Cliente sem login",
      product: selected.type === "members" ? `${qty} ${selected.name}` : selected.name,
      price: finalPrice,
      status: pixAuto === "automatico" ? "Aguardando confirmação automática Pix" : "Pagamento confirmado pelo cliente",
      date: new Date().toLocaleString("pt-BR")
    };
    const next = [order, ...orders];
    setOrders(next);
    localStorage.setItem("st_orders", JSON.stringify(next));
    setPaid(true);
    notify("Nova compra registrada no painel admin!");
  }

  const myOrders = currentUser ? orders.filter((o) => o.user === currentUser.email) : [];

  return (
    <div className="page">
      {notification && <div className="toast">🔔 {notification}</div>}

      <button className="mobileButton" onClick={() => setMobile(true)}>☰</button>

      <aside className={`sidebar ${mobile ? "show" : ""}`}>
        <button className="mobileClose" onClick={() => setMobile(false)}>×</button>

        <div className="profile">
          <div className="logoBull">🐂</div>
          <div>
            <b>STORE TAUROS <span>✓</span></b>
            <small>Loja oficial</small>
          </div>
        </div>

        <p>MENU</p>
        <a href="#home" className="active" onClick={() => setMobile(false)}>⌂ <span>Início</span></a>
        <button onClick={() => openCard("discord")}>💬 <span>Discord</span></button>
        <button onClick={() => openCard("membros")}>👥 <span>Membros</span></button>
        <button onClick={() => openCard("nitro")}>💎 <span>Nitro</span></button>
        <button onClick={() => openCard("designer")}>🎨 <span>Designer</span></button>
        <button onClick={() => window.open(DISCORD, "_blank")}>🎧 <span>Suporte</span></button>

        <p>CONTA</p>
        {currentUser ? (
          <>
            <button onClick={() => setOpenCatalog({ title: "Meus pedidos", custom: "orders" })}>📦 <span>Meus pedidos</span></button>
            <button onClick={logout}>↪ <span>Sair</span></button>
          </>
        ) : (
          <>
            <button onClick={() => setAuthMode("login")}>↪ <span>Entrar</span></button>
            <button onClick={() => setAuthMode("create")}>☊ <span>Criar conta</span></button>
          </>
        )}

        <p>ADMINISTRAÇÃO</p>
        <button className="adminBtn" onClick={() => setAdminLogin(true)}>🛡 <span>Painel Admin</span></button>

        <div className="discordBox">
          <b>Acessar Discord</b>
          <small>Comunidade oficial</small>
          <button onClick={() => window.open(DISCORD, "_blank")}>Entrar</button>
        </div>
      </aside>

      <main>
        <section id="home" className="hero">
          <div>
            <h1>Bem-Vindo(a) à<br /><span>Store Tauros!</span></h1>
            <p>Aqui você encontra tudo para elevar sua experiência, com produtos digitais premium, entrega automática e suporte dedicado.</p>
            <div className="benefits">
              <div>⚡ <b>Entrega automática</b><small>Instantânea</small></div>
              <div>🛡 <b>100% Seguro</b><small>Dados protegidos</small></div>
              <div>🎧 <b>Suporte 24/7</b><small>Sempre disponível</small></div>
            </div>
          </div>
          <div className="heroLogo">
            <div className="bullShape"></div>
            <h2>TAUROS</h2>
            <span>STORE</span>
          </div>
        </section>

        <section className="products">
          <h2>Nossos Produtos</h2>
          <p>Produtos digitais premium para você!</p>
          <div className="cards">
            {homeCards.map((card) => (
              <button className="card" key={card.key} onClick={() => openCard(card.key)}>
                <div className={`cardImg ${card.key}`}><span>{card.icon}</span></div>
                <div className="cardText"><h3>{card.title}</h3><p>{card.desc}</p><i>→</i></div>
              </button>
            ))}
          </div>
        </section>

        <section className="payment">
          <h2>Pagamento</h2>
          <p>Formas de pagamento</p>
          <button className="pixCard">
            <div>◆</div>
            <span><b>Apenas Pix</b><small>{pixAuto === "automatico" ? "Integração Pix automático preparada" : "Pagamento via PIX"}</small></span>
            <i>→</i>
          </button>
        </section>

        <section className="preview">
          <h2>Foto construída do site</h2>
          <img src="/assets/preview-storetauros.png" alt="Preview StoreTauros" />
        </section>

        <div className="help">
          <b>Precisa de ajuda?</b>
          <span>Entre no nosso Discord!</span>
          <button onClick={() => window.open(DISCORD, "_blank")}>💬</button>
        </div>
      </main>

      {openCatalog && (
        <div className="modalBg">
          <div className="modal catalog">
            <button className="close" onClick={() => setOpenCatalog(null)}>×</button>
            {openCatalog.custom === "orders" ? (
              <>
                <h2>Meus pedidos</h2>
                <div className="catalogList">
                  {myOrders.length === 0 ? <p>Nenhum pedido ainda.</p> : myOrders.map((o) => (
                    <div className="orderCard" key={o.id}><b>{o.product}</b><small>{o.price} • {o.status} • {o.date}</small></div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2>{openCatalog.title}</h2>
                <p>Escolha uma opção para comprar.</p>
                <div className="catalogList">
                  {openCatalog.items.map((item) => (
                    <button key={item.id} onClick={() => buyItem(item)}>
                      <span>{item.icon}</span>
                      <div><b>{item.name}</b><small>{item.desc}</small></div>
                      <strong>{item.type === "members" ? `A partir de ${money(item.unit)}` : money(item.price)}</strong>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selected && (
        <div className="modalBg">
          <div className="modal checkout">
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <div className="checkoutImg"><span>{selected.icon}</span></div>
            <div>
              <h2>{selected.name}</h2>
              <p>{selected.desc}</p>

              {selected.type === "members" && (
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                  {[100, 200, 300, 400, 5000].map((q) => (
                    <option key={q} value={q}>{q} membros - {money((q / 100) * selected.unit)}</option>
                  ))}
                </select>
              )}

              <strong className="price">{finalPrice}</strong>

              <div className="payBox">
                <h3>Pagamento Pix</h3>
                <p>{pix || "Pix ainda não cadastrado pelo admin."}</p>
                <button onClick={copyPix}>Copiar Pix</button>
                {qr && <img src={qr} alt="QR Pix" />}
              </div>

              {!paid ? (
                <button className="buy" onClick={confirmPayment}>Confirmar pagamento</button>
              ) : (
                <div className="success"><h3>✅ Pagamento confirmado!</h3><p>Abra o Discord para resgatar o pedido.</p><a href={DISCORD} target="_blank">Abrir Discord</a></div>
              )}
            </div>
          </div>
        </div>
      )}

      {authMode && (
        <div className="modalBg">
          <div className="modal auth">
            <button className="close" onClick={() => setAuthMode(null)}>×</button>
            <h2>{authMode === "create" ? "Criar conta" : "Entrar"}</h2>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {authMode === "create" && <input placeholder="Confirmar senha" type="password" />}
            <button onClick={() => authUser(authMode === "create")}>{authMode === "create" ? "Criar conta" : "Entrar"}</button>
            <p>{usingSupabase ? "Login usando Supabase." : "Modo local ativo. Para banco real, configure Supabase no Vercel."}</p>
          </div>
        </div>
      )}

      {adminLogin && (
        <div className="modalBg">
          <div className="modal auth">
            <button className="close" onClick={() => setAdminLogin(false)}>×</button>
            <h2>Painel Admin</h2>
            <input type="password" placeholder="Senha: admtauros" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
            <button onClick={loginAdmin}>Entrar</button>
          </div>
        </div>
      )}

      {adminOpen && (
        <div className="modalBg">
          <div className="modal admin">
            <button className="close" onClick={() => setAdminOpen(false)}>×</button>
            <h2>Painel de Administração</h2>
            <div className="adminGrid">
              <section><h3>Pix e QR</h3><input placeholder="Chave Pix" value={pix} onChange={(e) => setPix(e.target.value)} /><input type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setQr(String(r.result));r.readAsDataURL(f)}} />{qr && <img className="qr" src={qr} />}<button onClick={saveAdmin}>Salvar Pix/QR</button></section>
              <section><h3>Integração Pix</h3><select value={pixAuto} onChange={(e)=>setPixAuto(e.target.value)}><option value="simulado">Modo manual/simulado</option><option value="automatico">Pix automático preparado</option></select><p>Para ativar automático real, coloque API Mercado Pago/Gerencianet no backend.</p><button onClick={saveAdmin}>Salvar integração</button></section>
              <section><h3>Clientes cadastrados</h3><div className="orders">{users.length === 0 ? <p>Nenhum cliente.</p> : users.map((u)=><div key={u.email}><b>{u.email}</b><small>{u.createdAt}</small></div>)}</div></section>
              <section><h3>Vendas</h3><div className="orders">{orders.length === 0 ? <p>Nenhuma venda.</p> : orders.map((o)=><div key={o.id}><b>{o.product}</b><small>{o.user} • {o.price} • {o.status} • {o.date}</small></div>)}</div><button onClick={()=>{setOrders([]);localStorage.removeItem("st_orders")}}>Limpar vendas</button></section>
              <section><h3>Discord</h3><p>{DISCORD}</p><button onClick={() => window.open(DISCORD, "_blank")}>Abrir Discord</button></section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
