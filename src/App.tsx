
import React, { useMemo, useState } from "react";
import "./style.css";

const DISCORD_LINK = "https://discord.gg/WPH5Xc58cm";
const ADMIN_PASSWORD = "admtauros";

type MemberType = "Mistos" | "Reais" | "Premium";

type Product = {
  name: string;
  price: string;
  details: string;
};

const prices: Record<MemberType, number> = {
  Mistos: 2,
  Reais: 2.5,
  Premium: 6.5,
};

const quantities = [100, 200, 300, 400, 5000];

export default function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openList, setOpenList] = useState<MemberType | null>("Mistos");
  const [selected, setSelected] = useState<Product | null>(null);
  const [adminLogin, setAdminLogin] = useState(false);
  const [adminPanel, setAdminPanel] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [pixKey, setPixKey] = useState(localStorage.getItem("storetauros_pix") || "adm@storetauros.com");
  const [sales, setSales] = useState<string[]>(() => JSON.parse(localStorage.getItem("storetauros_sales") || "[]"));

  const memberCards = useMemo(() => {
    return (["Mistos", "Reais", "Premium"] as MemberType[]).map((type) => ({
      type,
      title: `Membros ${type}`,
      desc:
        type === "Mistos"
          ? "Membros mistos para movimentar seu servidor."
          : type === "Reais"
          ? "Membros reais e ativos para seu Discord."
          : "Membros premium com mais qualidade.",
      base: prices[type],
    }));
  }, []);

  function formatMoney(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function makeProduct(type: MemberType, quantity: number): Product {
    const value = (quantity / 100) * prices[type];
    return {
      name: `${quantity.toLocaleString("pt-BR")} Membros ${type}`,
      price: formatMoney(value),
      details: `Pacote de ${quantity.toLocaleString("pt-BR")} membros ${type.toLowerCase()} para Discord.`,
    };
  }

  function buy(product: Product) {
    setSelected(product);
    const order = `${product.name} | ${product.price} | ${new Date().toLocaleString("pt-BR")}`;
    const updated = [order, ...sales];
    setSales(updated);
    localStorage.setItem("storetauros_sales", JSON.stringify(updated));
  }

  function loginAdmin() {
    if (adminKey.trim() === ADMIN_PASSWORD) {
      setAdminLogin(false);
      setAdminPanel(true);
      setAdminKey("");
    } else {
      alert("Chave admin incorreta.");
    }
  }

  function savePix() {
    localStorage.setItem("storetauros_pix", pixKey);
    alert("Chave Pix salva com sucesso!");
  }

  function copyPix() {
    navigator.clipboard.writeText(pixKey);
    alert("Chave Pix copiada!");
  }

  return (
    <main className="page">
      <header className="top">
        <button className="menu-btn" onClick={() => setOpenMenu(true)}>•••</button>

        <div className="brand">
          <span>STORE</span><b>TAUROS</b>
          <small>A melhor store para seu Discord</small>
        </div>

        <button className="admin-top" onClick={() => setAdminLogin(true)}>🔒 Área do Admin</button>
      </header>

      {openMenu && (
        <div className="menu-modal">
          <div className="menu-card">
            <button className="close" onClick={() => setOpenMenu(false)}>×</button>
            <h2>Opções</h2>
            <a onClick={() => setOpenMenu(false)} href="#membros">Membros</a>
            <a onClick={() => setOpenMenu(false)} href="#extras">Designer / Conta nitrada</a>
            <a onClick={() => setOpenMenu(false)} href="#pix">Pix</a>
            <a onClick={() => setOpenMenu(false)} href="#como">Como funciona</a>
            <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Abrir ticket Discord</button>
          </div>
        </div>
      )}

      <section className="hero">
        <div className="banner-image">
          <div className="banner-text">
            <h1>TAUROS</h1>
            <span>STORE</span>
          </div>
          <div className="bull-art">
            <div className="horn h-left"></div>
            <div className="horn h-right"></div>
            <div className="head">
              <i className="eye e-left"></i>
              <i className="eye e-right"></i>
              <i className="nose"></i>
            </div>
          </div>
        </div>

        <div className="features">
          <div>⚡ <b>Entrega</b><span>Via ticket</span></div>
          <div>💠 <b>Pagamento</b><span>Via Pix</span></div>
          <div>🎧 <b>Suporte</b><span>Discord</span></div>
          <div>🛡️ <b>Seguro</b><span>100%</span></div>
          <div>⭐ <b>Qualidade</b><span>Premium</span></div>
        </div>
      </section>

      <section id="membros" className="layout">
        <div className="main-products">
          <h2>MEMBROS PARA DISCORD</h2>

          <div className="member-blocks">
            {memberCards.map((card) => (
              <article className={`member-block ${card.type.toLowerCase()}`} key={card.type}>
                <button className="member-head" onClick={() => setOpenList(openList === card.type ? null : card.type)}>
                  <span>{card.type === "Premium" ? "👑" : "👥"}</span>
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                  <b>{openList === card.type ? "▲" : "▼"}</b>
                </button>

                {openList === card.type && (
                  <div className="dropdown-list">
                    {quantities.map((q) => {
                      const p = makeProduct(card.type, q);
                      return (
                        <button key={q} onClick={() => buy(p)}>
                          <span>{q.toLocaleString("pt-BR")} membros</span>
                          <strong>{p.price}</strong>
                        </button>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div id="pix" className="pix-strip">
            <div>
              <h2>Pagamento via Pix</h2>
              <p>Use uma única chave Pix cadastrada pelo admin para todos os produtos.</p>
            </div>
            <div className="pix-key">
              <small>Chave Pix</small>
              <b>{pixKey}</b>
            </div>
            <button onClick={copyPix}>Copiar</button>
          </div>
        </div>

        <aside id="extras" className="side">
          <h2>Outros produtos</h2>

          <article className="side-product">
            <div className="side-icon">🎨</div>
            <div>
              <h3>Designer de Server</h3>
              <p>Design profissional para seu servidor Discord.</p>
              <strong>R$ 35,00</strong>
              <button onClick={() => buy({ name: "Designer de Server", price: "R$ 35,00", details: "Design profissional para servidor Discord." })}>
                Comprar agora
              </button>
            </div>
          </article>

          <article className="side-product purple">
            <div className="side-icon">💎</div>
            <div>
              <h3>Conta Nitrada</h3>
              <p>Conta nitrada com resgate somente no ticket.</p>
              <strong>R$ 5,00</strong>
              <button onClick={() => buy({ name: "Conta Nitrada", price: "R$ 5,00", details: "Conta nitrada com resgate via ticket." })}>
                Comprar agora
              </button>
            </div>
          </article>

          <div id="como" className="how">
            <h3>Como funciona</h3>
            <p><b>1.</b> Escolha o produto e quantidade.</p>
            <p><b>2.</b> Pague via Pix.</p>
            <p><b>3.</b> Após comprar, aparece o link do Discord.</p>
            <p><b>4.</b> Abra ticket e envie o comprovante.</p>
          </div>
        </aside>
      </section>

      <footer>
        <b>© 2026 Storetauros</b>
        <span>Resgate somente via ticket Discord.</span>
      </footer>

      {selected && (
        <div className="modal-bg">
          <div className="modal">
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <h2>Compra selecionada</h2>
            <h3>{selected.name}</h3>
            <p>{selected.details}</p>
            <strong className="price">{selected.price}</strong>

            <div className="pix-confirm">
              <small>Chave Pix única:</small>
              <b>{pixKey}</b>
              <button onClick={copyPix}>Copiar Pix</button>
            </div>

            <a className="discord-link" href={DISCORD_LINK} target="_blank" rel="noreferrer">
              Resgatar no Discord
            </a>
          </div>
        </div>
      )}

      {adminLogin && (
        <div className="modal-bg">
          <div className="modal small">
            <button className="close" onClick={() => setAdminLogin(false)}>×</button>
            <h2>Área do Admin</h2>
            <p>Entre usando a chave admin.</p>
            <input
              type="password"
              placeholder="Digite a chave"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loginAdmin()}
            />
            <button className="primary" onClick={loginAdmin}>Entrar</button>
          </div>
        </div>
      )}

      {adminPanel && (
        <div className="modal-bg">
          <div className="modal admin">
            <button className="close" onClick={() => setAdminPanel(false)}>×</button>
            <h2>Painel Admin Storetauros</h2>

            <div className="admin-grid">
              <section>
                <h3>Chave Pix única</h3>
                <p>Essa chave será usada para todos os produtos.</p>
                <input value={pixKey} onChange={(e) => setPixKey(e.target.value)} />
                <button className="primary" onClick={savePix}>Salvar chave Pix</button>
              </section>

              <section>
                <h3>Painel de vendas</h3>
                <p>{sales.length} vendas registradas neste navegador.</p>
                <div className="sales">
                  {sales.length === 0 && <span>Nenhuma venda registrada ainda.</span>}
                  {sales.map((sale, index) => <div key={index}>{sale}</div>)}
                </div>
              </section>
            </div>

            <p className="note">Observação: este painel salva no navegador. Para salvar em vários dispositivos, precisa banco de dados.</p>
          </div>
        </div>
      )}
    </main>
  );
}
