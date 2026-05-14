
import React, { useMemo, useState } from "react";

const DISCORD = "https://discord.gg/WPH5Xc58cm";
const ADMIN_PASS = "admtauros";

const products = [
  {
    id: "nitro",
    category: "Discord",
    title: "Nitro Discord",
    subtitle: "Resgate via ticket",
    price: "R$ 5,00+",
    image: "/assets/ref-2.png",
    badge: "NITRO",
    type: "fixed"
  },
  {
    id: "membros",
    category: "Discord",
    title: "Membros Discord",
    subtitle: "Membros para seu servidor",
    price: "R$ 2,00+",
    image: "/assets/ref-7.png",
    badge: "MEMBROS",
    type: "members"
  },
  {
    id: "conta-nitrada",
    category: "Discord",
    title: "Conta Nitrada",
    subtitle: "Conta pronta para resgate",
    price: "R$ 5,00+",
    image: "/assets/ref-2.png",
    badge: "NITRADA",
    type: "fixed"
  },
  {
    id: "designer",
    category: "Discord",
    title: "Designer de Server",
    subtitle: "Design completo para servidor",
    price: "R$ 35,00",
    image: "/assets/ref-7.png",
    badge: "DESIGN",
    type: "fixed"
  }
];

const categories = [
  { name: "Discord", total: "36 produtos", image: "/assets/ref-1.png" },
  { name: "Membros", total: "5 pacotes", image: "/assets/ref-7.png" },
  { name: "Nitro", total: "3 planos", image: "/assets/ref-2.png" },
  { name: "Designer", total: "1 pacote", image: "/assets/ref-8.png" }
];

const quantities = [100, 200, 300, 400, 5000];

function priceForMembers(type, qty) {
  const per100 = type === "mistos" ? 2 : type === "reais" ? 2.5 : 6.5;
  return ((qty / 100) * per100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [memberType, setMemberType] = useState("mistos");
  const [memberQty, setMemberQty] = useState(100);
  const [paid, setPaid] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const [pix, setPix] = useState(localStorage.getItem("st_pix") || "");
  const [qr, setQr] = useState(localStorage.getItem("st_qr") || "");
  const [banner, setBanner] = useState(localStorage.getItem("st_banner") || "A Maior Loja Digital da Store Tauros!");
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("st_orders") || "[]"));

  const finalMemberPrice = useMemo(() => priceForMembers(memberType, memberQty), [memberType, memberQty]);

  function openProduct(product) {
    setSelected(product);
    setPaid(false);
  }

  function confirmPayment() {
    const sale = {
      id: "ST-" + Math.floor(1000 + Math.random() * 9000),
      product: selected?.type === "members" ? `${memberQty} membros ${memberType}` : selected?.title,
      price: selected?.type === "members" ? finalMemberPrice : selected?.price,
      date: new Date().toLocaleString("pt-BR")
    };
    const next = [sale, ...orders];
    setOrders(next);
    localStorage.setItem("st_orders", JSON.stringify(next));
    setPaid(true);
  }

  function loginAdmin() {
    if (adminPassword === ADMIN_PASS) {
      setAdminLogin(false);
      setAdminOpen(true);
      setAdminPassword("");
    } else {
      alert("Senha incorreta");
    }
  }

  function saveAdmin() {
    localStorage.setItem("st_pix", pix);
    localStorage.setItem("st_qr", qr);
    localStorage.setItem("st_banner", banner);
    alert("Configurações salvas!");
  }

  function uploadQr(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setQr(String(reader.result));
    reader.readAsDataURL(file);
  }

  function copyPix() {
    if (!pix) return alert("Pix ainda não cadastrado pelo admin.");
    navigator.clipboard.writeText(pix);
    alert("Pix copiado!");
  }

  return (
    <div className="store">
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar">🐂</div>
          <b>Store Tauros <span>✓</span></b>
          <small>Loja oficial</small>
        </div>

        <p className="sideTitle">MENU</p>
        <a href="#home">⌂ <span>Início</span></a>
        <a href="#categorias">⌕ <span>Buscar</span></a>
        <a href="#produtos">▣ <span>Produtos</span></a>
        <button onClick={() => setSelected(products[0])}>🛒 <span>Carrinho</span></button>

        <p className="sideTitle">CATEGORIAS</p>
        <button onClick={() => window.open(DISCORD, "_blank")}>🎧 <span>Suporte</span></button>
        <button onClick={() => alert("Termos: pagamento via Pix e resgate via ticket.")}>📄 <span>Termos</span></button>
        <button onClick={() => setAdminLogin(true)}>⚙ <span>Painel ADM</span></button>

        <div className="ticketBox">
          <b>Resgate via Ticket</b>
          <p>Após pagar, abra o Discord para receber seu pedido.</p>
          <button onClick={() => window.open(DISCORD, "_blank")}>Discord</button>
        </div>
      </aside>

      <main>
        <header className="top">
          <div className="logo">STORE<span>TAUROS</span></div>
          <nav>
            <a href="#home">Início</a>
            <a href="#categorias">Categorias</a>
            <a href="#produtos">Produtos</a>
            <button onClick={() => window.open(DISCORD, "_blank")}>Discord</button>
          </nav>
          <div className="topActions">
            <button onClick={() => setCreateOpen(true)}>Criar conta</button>
            <button onClick={() => setLoginOpen(true)}>Entrar</button>
          </div>
        </header>

        <section id="home" className="hero">
          <div>
            <div className="chips"><span>⚡ Entrega automática</span><span>🛡 Compra 100% segura</span></div>
            <h1>{banner.replace("Store Tauros", "")}<br/><span>Store Tauros</span></h1>
            <p>Nossa loja oferece produtos digitais para Discord com preços competitivos, suporte ativo e resgate simples pelo ticket.</p>
            <div className="heroBtns">
              <a href="#produtos">Explorar produtos →</a>
              <button onClick={() => window.open(DISCORD, "_blank")}>Comunidade</button>
            </div>
            <div className="stats"><b>24h</b><span>Suporte ativo</span><b>100%</b><span>Digital</span><b>Pix</b><span>Pagamento instantâneo</span></div>
          </div>

          <div className="featureGrid">
            <article className="bigFeature">⚡<h3>Entrega automática</h3><p>Seu produto é liberado após a confirmação.</p></article>
            <article>🛡<h3>100% Seguro</h3><p>Dados protegidos</p></article>
            <article>🎧<h3>Suporte 24h</h3><p>Sempre disponível</p></article>
            <article className="wide">💠<h3>Pix, cartão e mais</h3><p>Pagamento por Pix cadastrado no admin</p></article>
          </div>
        </section>

        <section id="categorias" className="categories">
          <div className="sectionHead"><h2>Categorias</h2><span>{categories.length} disponíveis</span></div>
          <div className="categoryGrid">
            {categories.map((cat) => (
              <button className="categoryCard" key={cat.name} onClick={() => document.getElementById("produtos")?.scrollIntoView()}>
                <img src={cat.image} alt={cat.name}/>
                <div><h3>{cat.name}</h3><p>{cat.total}</p></div>
                <span className="arrow">→</span>
              </button>
            ))}
          </div>
        </section>

        <section id="produtos" className="products">
          <div className="sectionHead"><h2>Produtos</h2><span>À vista no Pix</span></div>
          <div className="productGrid">
            {products.map((product) => (
              <article className="productCard" key={product.id}>
                <div className="dots">•••</div>
                <img src={product.image} alt={product.title}/>
                <div className="productBody">
                  <strong>{product.price}</strong>
                  <h3>{product.title}</h3>
                  <p>{product.subtitle}</p>
                  <button onClick={() => openProduct(product)}>🛒 Comprar agora</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer>
          <b>StoreTauros</b>
          <span>© 2026 — Loja digital com resgate via Discord.</span>
        </footer>
      </main>

      {selected && (
        <div className="modalBg">
          <div className="modal productModal">
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <img src={selected.image} alt={selected.title}/>
            <div className="productInfo">
              <span className="stock">13 em estoque</span>
              <h2>{selected.title}</h2>
              <strong>{selected.type === "members" ? finalMemberPrice : selected.price}</strong>
              {selected.type === "members" && (
                <div className="memberOptions">
                  <select value={memberType} onChange={(e) => setMemberType(e.target.value)}>
                    <option value="mistos">Membros Mistos - R$ 2/100</option>
                    <option value="reais">Membros Reais - R$ 2,50/100</option>
                    <option value="premium">Membros Premium - R$ 6,50/100</option>
                  </select>
                  <select value={memberQty} onChange={(e) => setMemberQty(Number(e.target.value))}>
                    {[100,200,300,400,5000].map(q => <option key={q} value={q}>{q} membros</option>)}
                  </select>
                </div>
              )}
              <div className="payBox">
                <h3>Pagamento Pix</h3>
                <p>{pix || "Pix ainda não cadastrado pelo admin."}</p>
                <button onClick={copyPix}>Copiar Pix</button>
                {qr && <img src={qr} alt="QR Pix"/>}
              </div>
              {!paid ? <button className="buyNow" onClick={confirmPayment}>Confirmar pagamento</button> : (
                <div className="confirmed"><h3>✅ Pagamento confirmado!</h3><p>Abra o Discord para resgatar.</p><a href={DISCORD} target="_blank">Abrir Discord</a></div>
              )}
            </div>
          </div>
        </div>
      )}

      {(loginOpen || createOpen) && (
        <div className="modalBg">
          <div className="authModal">
            <button className="close" onClick={() => {setLoginOpen(false);setCreateOpen(false)}}>×</button>
            <h2>{createOpen ? "Criar conta" : "Entrar"}</h2>
            <input placeholder="Email"/>
            <input placeholder="Senha" type="password"/>
            {createOpen && <input placeholder="Confirmar senha" type="password"/>}
            <button onClick={() => alert("Login visual criado. Para funcionar real precisa banco de dados.")}>{createOpen ? "Criar conta" : "Entrar"}</button>
          </div>
        </div>
      )}

      {adminLogin && (
        <div className="modalBg">
          <div className="authModal">
            <button className="close" onClick={() => setAdminLogin(false)}>×</button>
            <h2>Painel ADM</h2>
            <input type="password" placeholder="Senha: admtauros" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&loginAdmin()}/>
            <button onClick={loginAdmin}>Entrar no painel</button>
          </div>
        </div>
      )}

      {adminOpen && (
        <div className="modalBg">
          <div className="modal adminModal">
            <button className="close" onClick={() => setAdminOpen(false)}>×</button>
            <h2>Painel de Administração</h2>
            <div className="adminGrid">
              <section><h3>Pix e QR</h3><input value={pix} onChange={(e)=>setPix(e.target.value)} placeholder="Chave Pix"/><input type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setQr(String(r.result));r.readAsDataURL(f)}}/>{qr&&<img className="qrPreview" src={qr}/>}<button onClick={()=>{localStorage.setItem("st_pix",pix);localStorage.setItem("st_qr",qr);alert("Salvo")}}>Salvar</button></section>
              <section><h3>Banner</h3><input value={banner} onChange={(e)=>setBanner(e.target.value)}/><button onClick={()=>{localStorage.setItem("st_banner",banner);alert("Banner salvo")}}>Salvar banner</button></section>
              <section><h3>Vendas</h3><div className="orders">{orders.length===0?<p>Nenhuma venda.</p>:orders.map(o=><div key={o.id}><b>{o.product}</b><small>{o.price} - {o.date}</small></div>)}</div><button onClick={()=>{setOrders([]);localStorage.removeItem("st_orders")}}>Limpar vendas</button></section>
              <section><h3>Discord</h3><p>{DISCORD}</p><button onClick={()=>window.open(DISCORD,"_blank")}>Abrir Discord</button></section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
