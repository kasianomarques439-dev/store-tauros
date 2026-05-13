
import React, { useState } from "react";

const DISCORD_LINK = "https://discord.gg/WPH5Xc58cm";

type Product = {
  name: string;
  price: string;
  type: string;
};

export default function App() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [pix, setPix] = useState(localStorage.getItem("pix") || "COLOQUE-SUA-CHAVE-PIX-AQUI");

  const products: Product[] = [
    { name: "100 Membros Mistos", price: "R$ 2,00", type: "Membros mistos" },
    { name: "100 Membros Reais", price: "R$ 2,50", type: "Membros reais" },
    { name: "500 Membros Discord", price: "R$ 6,50", type: "Membros Discord" },
  ];

  function savePix() {
    localStorage.setItem("pix", pix);
    alert("Chave Pix salva com sucesso!");
  }

  function openDiscord(product?: Product) {
    const text = product
      ? `Olá, quero comprar: ${product.name} - ${product.price}`
      : "Olá, quero abrir um ticket na Store Tauros.";
    window.open(`${DISCORD_LINK}?pedido=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.logo}>STORE TAUROS</h1>
          <p style={styles.small}>Loja gamer de membros, impulsos e produtos digitais</p>
        </div>

        <div style={styles.nav}>
          <button style={styles.navButton} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Início</button>
          <button style={styles.navButton} onClick={() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })}>Produtos</button>
          <button style={styles.navButton} onClick={() => openDiscord()}>Suporte</button>
          <button style={styles.adminButton} onClick={() => setAdminOpen(true)}>Admin</button>
        </div>
      </header>

      <section style={styles.hero}>
        <div>
          <p style={styles.badge}>A LOJA Nº1 EM PRODUTOS PARA DISCORD</p>
          <h2 style={styles.title}>STORE <span style={styles.neon}>TAUROS</span></h2>
          <p style={styles.subtitle}>Qualidade, confiança e poder para elevar seu servidor ao topo.</p>

          <div style={styles.heroButtons}>
            <button style={styles.buyMain} onClick={() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })}>Ver produtos</button>
            <button style={styles.outline} onClick={() => openDiscord()}>Abrir ticket</button>
          </div>
        </div>

        <div style={styles.bullBox}>
          <div style={styles.bull}>🐂</div>
          <h3 style={styles.bullTitle}>DOMINE SEU DISCORD</h3>
          <p style={styles.small}>Membros, boosts, designs e suporte via ticket.</p>
        </div>
      </section>

      <section style={styles.features}>
        <div style={styles.feature}>🛡️ Compra segura</div>
        <div style={styles.feature}>⚡ Entrega manual</div>
        <div style={styles.feature}>💎 Qualidade premium</div>
        <div style={styles.feature}>🎧 Suporte Discord</div>
      </section>

      <section id="produtos" style={styles.productsSection}>
        <h2 style={styles.sectionTitle}>PRODUTOS EM DESTAQUE</h2>

        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.name} style={styles.card}>
              <div style={styles.icon}>👥</div>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.desc}>{product.type} para aumentar seu servidor Discord.</p>
              <p style={styles.from}>A partir de</p>
              <p style={styles.price}>{product.price}</p>
              <button style={styles.buyButton} onClick={() => setSelected(product)}>COMPRAR</button>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.ticketBox}>
        <h2>Como funciona?</h2>
        <p>O cliente escolhe o produto, copia a chave Pix, realiza o pagamento e abre um ticket no Discord enviando o comprovante.</p>
        <button style={styles.buyMain} onClick={() => openDiscord()}>Abrir ticket no Discord</button>
      </section>

      {selected && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>
            <button style={styles.close} onClick={() => setSelected(null)}>X</button>
            <h2 style={styles.modalTitle}>Confirmar compra</h2>
            <p>Produto: <b>{selected.name}</b></p>
            <p style={styles.price}>{selected.price}</p>

            <div style={styles.pixBox}>
              <p style={styles.badge}>CHAVE PIX</p>
              <p style={styles.pixText}>{pix}</p>
            </div>

            <button style={styles.buyButton} onClick={() => openDiscord(selected)}>Já paguei, abrir ticket</button>
          </div>
        </div>
      )}

      {adminOpen && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>
            <button style={styles.close} onClick={() => setAdminOpen(false)}>X</button>
            <h2 style={styles.modalTitle}>Painel Admin</h2>
            <p>Cadastre ou altere sua chave Pix abaixo:</p>

            <input
              style={styles.input}
              value={pix}
              onChange={(e) => setPix(e.target.value)}
              placeholder="Digite sua chave Pix"
            />

            <button style={styles.buyButton} onClick={savePix}>Salvar Pix</button>
            <p style={styles.warn}>Observação: este painel salva o Pix no navegador. Para painel admin com senha e banco de dados, precisa backend.</p>
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        © 2026 Store Tauros — Entrega manual via ticket Discord
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #0f3cff55, transparent 35%), #020617",
    color: "white",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #0ea5e955",
    borderRadius: 18,
    padding: "15px 25px",
    background: "#020617cc",
    position: "sticky",
    top: 10,
    zIndex: 5,
  },
  logo: { color: "#38bdf8", margin: 0, fontSize: 28, fontWeight: 900 },
  small: { color: "#cbd5e1", margin: 0 },
  nav: { display: "flex", gap: 10, flexWrap: "wrap" },
  navButton: { background: "transparent", color: "white", border: "1px solid #1d4ed8", borderRadius: 10, padding: "10px 14px", cursor: "pointer" },
  adminButton: { background: "#0ea5e9", color: "black", border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontWeight: 900 },
  hero: {
    marginTop: 30,
    padding: 40,
    borderRadius: 28,
    border: "1px solid #0ea5e955",
    background: "linear-gradient(135deg,#020617,#0b1f45)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: 30,
    alignItems: "center",
  },
  badge: { color: "#38bdf8", fontWeight: 900 },
  title: { fontSize: 70, margin: "10px 0", fontWeight: 900 },
  neon: { color: "#0ea5e9", textShadow: "0 0 25px #0ea5e9" },
  subtitle: { fontSize: 22, color: "#e2e8f0" },
  heroButtons: { display: "flex", gap: 15, flexWrap: "wrap" },
  buyMain: { background: "#2563eb", color: "white", border: "none", borderRadius: 12, padding: "14px 25px", cursor: "pointer", fontWeight: 900 },
  outline: { background: "transparent", color: "#38bdf8", border: "1px solid #38bdf8", borderRadius: 12, padding: "14px 25px", cursor: "pointer", fontWeight: 900 },
  bullBox: { textAlign: "center", border: "1px solid #38bdf855", borderRadius: 25, padding: 30, background: "#020617aa" },
  bull: { fontSize: 130 },
  bullTitle: { fontSize: 30, color: "#38bdf8" },
  features: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 15, marginTop: 25 },
  feature: { background: "#0f172a", border: "1px solid #0ea5e955", borderRadius: 18, padding: 18, textAlign: "center", fontWeight: 900 },
  productsSection: { marginTop: 50 },
  sectionTitle: { textAlign: "center", fontSize: 34 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 20 },
  card: { background: "linear-gradient(180deg,#082f49,#020617)", border: "1px solid #0ea5e9", borderRadius: 22, padding: 25, textAlign: "center", boxShadow: "0 0 25px #0ea5e933" },
  icon: { fontSize: 70 },
  productName: { fontSize: 24 },
  desc: { color: "#cbd5e1" },
  from: { color: "#94a3b8" },
  price: { color: "#22d3ee", fontSize: 34, fontWeight: 900 },
  buyButton: { width: "100%", background: "#2563eb", color: "white", border: "none", borderRadius: 12, padding: 14, cursor: "pointer", fontWeight: 900 },
  ticketBox: { marginTop: 50, background: "#0f172a", border: "1px solid #0ea5e955", borderRadius: 22, padding: 30, textAlign: "center" },
  modalBg: { position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, padding: 20 },
  modal: { width: "100%", maxWidth: 480, background: "#020617", border: "1px solid #38bdf8", borderRadius: 22, padding: 25, position: "relative" },
  close: { position: "absolute", top: 12, right: 12, background: "#ef4444", color: "white", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" },
  modalTitle: { color: "#38bdf8" },
  pixBox: { background: "#0f172a", border: "1px dashed #38bdf8", borderRadius: 15, padding: 18, marginBottom: 18 },
  pixText: { fontSize: 18, wordBreak: "break-word" },
  input: { width: "100%", padding: 14, borderRadius: 12, border: "1px solid #38bdf8", background: "#0f172a", color: "white", marginBottom: 15 },
  warn: { color: "#94a3b8", fontSize: 13 },
  footer: { marginTop: 50, textAlign: "center", color: "#94a3b8" },
};
