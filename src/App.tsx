
import React, { useEffect, useMemo, useState } from "react";
import "./style.css";

const DISCORD_LINK = "https://discord.gg/WPH5Xc58cm";
const ADMIN_KEY = "admtauros";

type Product = {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  tag: string;
  theme: string;
  icon: string;
};

type Sale = {
  id: string;
  product: string;
  price: string;
  date: string;
  status: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "100 Membros Mistos",
    subtitle: "Membros mistos para Discord",
    price: "R$ 2,00",
    tag: "MAIS VENDIDO",
    theme: "green",
    icon: "👥",
  },
  {
    id: 2,
    name: "100 Membros Reais",
    subtitle: "Membros reais e ativos",
    price: "R$ 2,50",
    tag: "POPULARES",
    theme: "purple",
    icon: "👑",
  },
  {
    id: 3,
    name: "500 Membros Discord",
    subtitle: "Pacote para crescer rápido",
    price: "R$ 6,50",
    tag: "EM ALTA",
    theme: "blue",
    icon: "⚡",
  },
  {
    id: 4,
    name: "Designer de Servidor",
    subtitle: "Design profissional",
    price: "R$ 15,00",
    tag: "DESIGNER",
    theme: "cyan",
    icon: "🎨",
  },
  {
    id: 5,
    name: "U100 Digital",
    subtitle: "Códigos 100% originais",
    price: "R$ 3,00",
    tag: "NOVO",
    theme: "gold",
    icon: "U100",
  },
  {
    id: 6,
    name: "Pacote Completo",
    subtitle: "Mais por menos",
    price: "R$ 20,00",
    tag: "PACOTES",
    theme: "teal",
    icon: "📦",
  },
];

const defaultSales: Sale[] = [
  { id: "T-1001", product: "100 Membros Mistos", price: "R$ 2,00", date: "Hoje", status: "Pendente" },
  { id: "T-1002", product: "100 Membros Reais", price: "R$ 2,50", date: "Hoje", status: "Aguardando ticket" },
];

export default function App() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [pixKey, setPixKey] = useState(localStorage.getItem("taurosPixKey") || "cadastre-sua-chave-pix");
  const [pixQr, setPixQr] = useState(localStorage.getItem("taurosPixQr") || "");
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem("taurosSales");
    return saved ? JSON.parse(saved) : defaultSales;
  });

  useEffect(() => {
    localStorage.setItem("taurosSales", JSON.stringify(sales));
  }, [sales]);

  const totalSales = useMemo(() => sales.length, [sales]);

  function openDiscord(product?: Product) {
    const msg = product
      ? `Olá, quero comprar: ${product.name} - ${product.price}. Já fiz o pagamento e vou enviar o comprovante.`
      : "Olá, quero abrir um ticket na Store Tauros.";
    window.open(DISCORD_LINK, "_blank");

    if (product) {
      const newSale: Sale = {
        id: "T-" + Math.floor(1000 + Math.random() * 9000),
        product: product.name,
        price: product.price,
        date: new Date().toLocaleString("pt-BR"),
        status: "Aguardando comprovante",
      };
      setSales((prev) => [newSale, ...prev]);
      setSelected(null);
    }
  }

  function savePix() {
    localStorage.setItem("taurosPixKey", pixKey);
    localStorage.setItem("taurosPixQr", pixQr);
    alert("Pix e QR Code salvos com sucesso!");
  }

  function loginAdmin() {
    if (adminKey === ADMIN_KEY) {
      setAdminLoginOpen(false);
      setAdminOpen(true);
      setAdminKey("");
    } else {
      alert("Chave admin incorreta!");
    }
  }

  function uploadQr(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPixQr(String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="page">
      <div className="bg-grid" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">🐂</div>
          <div>
            <h1>STORE TAUROS</h1>
            <p>Produtos para Discord</p>
          </div>
        </div>

        <nav>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>INÍCIO</button>
          <button onClick={() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })}>MEMBROS</button>
          <button onClick={() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })}>NITRO</button>
          <button onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}>COMO FUNCIONA</button>
          <button onClick={() => openDiscord()}>SUPORTE</button>
        </nav>

        <div className="top-actions">
          <button className="cart">🛒 CARRINHO <span>0</span></button>
          <button className="login" onClick={() => setAdminLoginOpen(true)}>ENTRAR 🎮</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-left">
          <p className="eyebrow">A LOJA Nº1 EM PRODUTOS PARA DISCORD</p>
          <h2><span>STORE</span> TAUROS</h2>
          <h3>QUALIDADE, CONFIANÇA E PODER<br />PARA LEVAR SEU SERVIDOR AO TOPO!</h3>

          <div className="benefits">
            <div>🛡️<small>COMPRA<br />SEGURA</small></div>
            <div>⚡<small>ENTREGA<br />MANUAL</small></div>
            <div>💎<small>QUALIDADE<br />PREMIUM</small></div>
            <div>🎧<small>SUPORTE<br />24/7</small></div>
          </div>

          <div className="pix-card">
            <strong>💠 PAGAMENTO VIA <b>PIX</b></strong>
            <span>APROVAÇÃO MANUAL VIA TICKET</span>
          </div>
        </div>

        <div className="bull-hero">
          <div className="bull-glow">🐂</div>
          <div className="hero-panel">
            <div className="crown">♛</div>
            <h3>DOMINE SEU <span>DISCORD</span></h3>
            <p>Membros, Nitros, Designs e muito mais!</p>
            <button onClick={() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })}>VER PRODUTOS ›</button>
          </div>
        </div>
      </section>

      <section id="produtos" className="products">
        <h2>PRODUTOS EM DESTAQUE</h2>
        <div className="product-grid">
          {products.map((p) => (
            <article className={`product ${p.theme}`} key={p.id}>
              <span className="tag">{p.tag}</span>
              <div className="product-icon">{p.icon}</div>
              <h3>{p.name}</h3>
              <p>{p.subtitle}</p>
              <small>A partir de</small>
              <strong>{p.price}</strong>
              <button onClick={() => setSelected(p)}>🛒 COMPRAR</button>
            </article>
          ))}
        </div>
      </section>

      <section className="stats">
        <div>👥 <b>+10.000</b><span>CLIENTES SATISFEITOS</span></div>
        <div>🛍️ <b>+50.000</b><span>PEDIDOS ENTREGUES</span></div>
        <div>🛡️ <b>+3 ANOS</b><span>NO MERCADO</span></div>
        <div>⭐ <b>99.9%</b><span>AVALIAÇÕES POSITIVAS</span></div>
      </section>

      <section id="como-funciona" className="how">
        <h2>COMO FUNCIONA</h2>
        <div className="steps">
          <div><b>1</b><h3>Escolha o produto</h3><p>Clique em comprar no produto desejado.</p></div>
          <div><b>2</b><h3>Pague no Pix</h3><p>Use a chave Pix ou o QR Code cadastrado.</p></div>
          <div><b>3</b><h3>Abra ticket</h3><p>Envie o comprovante no Discord.</p></div>
          <div><b>4</b><h3>Receba manualmente</h3><p>A equipe entrega após confirmação.</p></div>
        </div>
      </section>

      {selected && (
        <div className="modal-bg">
          <div className="modal buy-modal">
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <h2>CONFIRMAR COMPRA</h2>
            <p className="selected-product">{selected.name}</p>
            <strong className="selected-price">{selected.price}</strong>

            <div className="payment-area">
              <div>
                <h3>Chave Pix</h3>
                <p className="pix-key">{pixKey}</p>
              </div>

              <div className="qr-area">
                {pixQr ? <img src={pixQr} alt="QR Code Pix" /> : <span>QR Code ainda não cadastrado</span>}
              </div>
            </div>

            <button className="primary" onClick={() => openDiscord(selected)}>JÁ PAGUEI, ABRIR TICKET</button>
          </div>
        </div>
      )}

      {adminLoginOpen && (
        <div className="modal-bg">
          <div className="modal">
            <button className="close" onClick={() => setAdminLoginOpen(false)}>×</button>
            <h2>ACESSO ADMIN</h2>
            <p>Digite a chave para entrar no painel.</p>
            <input
              type="password"
              placeholder="Chave admin"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loginAdmin()}
            />
            <button className="primary" onClick={loginAdmin}>ENTRAR NO PAINEL</button>
          </div>
        </div>
      )}

      {adminOpen && (
        <div className="modal-bg">
          <div className="modal admin-modal">
            <button className="close" onClick={() => setAdminOpen(false)}>×</button>
            <h2>PAINEL ADMIN STORE TAUROS</h2>

            <div className="admin-grid">
              <div className="admin-card">
                <h3>💰 Cadastrar Pix</h3>
                <label>Chave Pix</label>
                <input value={pixKey} onChange={(e) => setPixKey(e.target.value)} placeholder="Digite sua chave Pix" />

                <label>QR Code Pix</label>
                <input type="file" accept="image/*" onChange={uploadQr} />

                <div className="qr-preview">
                  {pixQr ? <img src={pixQr} alt="QR Pix" /> : <span>Prévia do QR Code</span>}
                </div>

                <button className="primary" onClick={savePix}>SALVAR PIX</button>
              </div>

              <div className="admin-card">
                <h3>📊 Vendas</h3>
                <div className="sale-total">{totalSales}<span>pedidos registrados</span></div>
                <div className="sales-list">
                  {sales.map((sale) => (
                    <div className="sale" key={sale.id}>
                      <div>
                        <b>{sale.product}</b>
                        <small>{sale.id} • {sale.date}</small>
                      </div>
                      <strong>{sale.price}</strong>
                      <em>{sale.status}</em>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="admin-note">
              Painel demonstrativo: a chave Pix, QR Code e vendas ficam salvos no navegador. Para salvar para todos os dispositivos, precisa banco de dados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
