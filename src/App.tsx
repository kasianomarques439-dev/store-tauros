
import React, { useMemo, useState } from "react";
import "./style.css";

const DISCORD_LINK = "https://discord.gg/WPH5Xc58cm";
const ADMIN_KEY = "admtauros";

type MemberType = "Mistos" | "Reais" | "Premium";

type CartItem = {
  nome: string;
  preco: string;
  detalhe: string;
};

const memberPrices: Record<MemberType, number> = {
  Mistos: 2,
  Reais: 2.5,
  Premium: 6.5,
};

const quantities = [100, 200, 300, 400, 5000];

export default function App() {
  const [memberTab, setMemberTab] = useState<MemberType>("Mistos");
  const [selected, setSelected] = useState<CartItem | null>(null);
  const [adminLogin, setAdminLogin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [pixKey, setPixKey] = useState(localStorage.getItem("taurosPixKey") || "Cadastre sua chave Pix no painel admin");
  const [qrPix, setQrPix] = useState(localStorage.getItem("taurosQrPix") || "");
  const [orders, setOrders] = useState<string[]>(() => JSON.parse(localStorage.getItem("taurosOrders") || "[]"));

  const memberOptions = useMemo(() => {
    return quantities.map((qtd) => {
      const price = (qtd / 100) * memberPrices[memberTab];
      return {
        nome: `${qtd.toLocaleString("pt-BR")} Membros ${memberTab}`,
        preco: money(price),
        detalhe: `Pacote de ${qtd.toLocaleString("pt-BR")} membros ${memberTab.toLowerCase()} para Discord`,
      };
    });
  }, [memberTab]);

  function money(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function openBuy(item: CartItem) {
    setSelected(item);
  }

  function confirmTicket() {
    if (!selected) return;
    const registro = `${selected.nome} - ${selected.preco} - ${new Date().toLocaleString("pt-BR")}`;
    const newOrders = [registro, ...orders];
    setOrders(newOrders);
    localStorage.setItem("taurosOrders", JSON.stringify(newOrders));
    window.open(DISCORD_LINK, "_blank");
    setSelected(null);
  }

  function loginAdmin() {
    if (adminKey === ADMIN_KEY) {
      setAdminLogin(false);
      setAdminOpen(true);
      setAdminKey("");
    } else {
      alert("Chave admin incorreta.");
    }
  }

  function uploadQr(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setQrPix(String(reader.result));
    reader.readAsDataURL(file);
  }

  function savePix() {
    localStorage.setItem("taurosPixKey", pixKey);
    localStorage.setItem("taurosQrPix", qrPix);
    alert("Pix salvo com sucesso!");
  }

  return (
    <main className="site">
      <header className="nav">
        <div className="logo">
          <div className="bull-logo">🐂</div>
          <div>
            <b>STORE</b>
            <strong>TAUROS</strong>
          </div>
        </div>

        <nav>
          <a href="#inicio">Início</a>
          <a href="#membros">Membros</a>
          <a href="#extras">Extras</a>
          <a href="#funciona">Como funciona</a>
          <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Suporte</button>
        </nav>

        <button className="admin-btn" onClick={() => setAdminLogin(true)}>Entrar Admin</button>
      </header>

      <section id="inicio" className="hero">
        <div className="hero-text">
          <span className="pill">A MELHOR STORE PARA DISCORD</span>
          <h1>
            QUALIDADE, CONFIANÇA
            <br />
            E PODER PARA SEU
            <em> DISCORD!</em>
          </h1>
          <p>
            Venda focada em membros para servidor, designer profissional e contas nitradas.
            Atendimento e resgate sempre via ticket.
          </p>

          <div className="hero-actions">
            <a href="#membros">Ver membros</a>
            <button onClick={() => window.open(DISCORD_LINK, "_blank")}>Abrir ticket</button>
          </div>

          <div className="features">
            <span>🛡️ Compra segura</span>
            <span>⚡ Resgate via ticket</span>
            <span>💠 Pix manual</span>
            <span>🎧 Suporte ativo</span>
          </div>
        </div>

        <div className="hero-bull">
          <div className="blue-bull">
            <div className="horn left"></div>
            <div className="horn right"></div>
            <div className="face">
              <div className="eye left-eye"></div>
              <div className="eye right-eye"></div>
              <div className="nose"></div>
              <div className="mouth"></div>
            </div>
          </div>
          <div className="discount">
            <b>STORE</b>
            <strong>TAUROS</strong>
            <span>vendas via ticket</span>
          </div>
        </div>
      </section>

      <section id="membros" className="section">
        <div className="title">
          <span>MEMBROS DISCORD</span>
          <h2>Escolha o tipo de membro</h2>
          <p>Cada 100 membros multiplica o valor conforme o tipo escolhido.</p>
        </div>

        <div className="tabs">
          {(["Mistos", "Reais", "Premium"] as MemberType[]).map((tab) => (
            <button
              key={tab}
              className={memberTab === tab ? "active" : ""}
              onClick={() => setMemberTab(tab)}
            >
              Membros {tab}
              <small>
                {tab === "Mistos" && "R$ 2,00 / 100"}
                {tab === "Reais" && "R$ 2,50 / 100"}
                {tab === "Premium" && "R$ 6,50 / 100"}
              </small>
            </button>
          ))}
        </div>

        <div className="cards members-grid">
          {memberOptions.map((item) => (
            <article className="card member-card" key={item.nome}>
              <div className="icon">👥</div>
              <h3>{item.nome}</h3>
              <p>{item.detalhe}</p>
              <small>A partir de</small>
              <strong>{item.preco}</strong>
              <button onClick={() => openBuy(item)}>Comprar</button>
            </article>
          ))}
        </div>
      </section>

      <section id="extras" className="section">
        <div className="title">
          <span>PRODUTOS EXTRAS</span>
          <h2>Designer e conta nitrada</h2>
          <p>Produtos com entrega manual e resgate somente pelo ticket Discord.</p>
        </div>

        <div className="cards extras-grid">
          <article className="card design-card">
            <div className="icon">🎨</div>
            <h3>Designer de Servidor</h3>
            <p>Organização, cargos, canais, decoração e visual profissional para seu servidor.</p>
            <small>Valor</small>
            <strong>R$ 35,00</strong>
            <button onClick={() => openBuy({ nome: "Designer de Servidor", preco: "R$ 35,00", detalhe: "Design completo para servidor Discord" })}>Comprar</button>
          </article>

          <article className="card nitro-card">
            <div className="icon">💎</div>
            <h3>Conta Nitrada</h3>
            <p>Conta nitrada com resgate e entrega somente via ticket com a equipe.</p>
            <small>Valor</small>
            <strong>R$ 5,00</strong>
            <button onClick={() => openBuy({ nome: "Conta Nitrada", preco: "R$ 5,00", detalhe: "Conta nitrada via ticket" })}>Comprar</button>
          </article>
        </div>
      </section>

      <section id="funciona" className="how">
        <h2>COMO FUNCIONA</h2>
        <div>
          <article><b>1</b><span>Escolha o produto</span></article>
          <article><b>2</b><span>Copie o Pix ou QR Code</span></article>
          <article><b>3</b><span>Abra ticket no Discord</span></article>
          <article><b>4</b><span>Envie o comprovante</span></article>
        </div>
      </section>

      <footer>
        <div className="logo">
          <div className="bull-logo">🐂</div>
          <div>
            <b>STORE</b>
            <strong>TAUROS</strong>
          </div>
        </div>
        <p>© 2026 Store Tauros — vendas e resgates somente via ticket.</p>
      </footer>

      {selected && (
        <div className="modal-bg">
          <div className="modal">
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <h2>Finalizar compra</h2>
            <p className="selected">{selected.nome}</p>
            <strong className="modal-price">{selected.preco}</strong>

            <div className="payment">
              <div>
                <h3>Chave Pix</h3>
                <p>{pixKey}</p>
              </div>
              <div className="qr">
                {qrPix ? <img src={qrPix} alt="QR Code Pix" /> : <span>QR Code Pix não cadastrado</span>}
              </div>
            </div>

            <button className="primary" onClick={confirmTicket}>Já paguei, abrir ticket</button>
          </div>
        </div>
      )}

      {adminLogin && (
        <div className="modal-bg">
          <div className="modal small">
            <button className="close" onClick={() => setAdminLogin(false)}>×</button>
            <h2>Painel Admin</h2>
            <p>Digite a chave para acessar.</p>
            <input
              type="password"
              placeholder="Chave admin"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loginAdmin()}
            />
            <button className="primary" onClick={loginAdmin}>Entrar</button>
          </div>
        </div>
      )}

      {adminOpen && (
        <div className="modal-bg">
          <div className="modal admin">
            <button className="close" onClick={() => setAdminOpen(false)}>×</button>
            <h2>Admin Store Tauros</h2>

            <div className="admin-grid">
              <div className="admin-box">
                <h3>Cadastrar Pix</h3>
                <label>Chave Pix</label>
                <input value={pixKey} onChange={(e) => setPixKey(e.target.value)} />

                <label>QR Code Pix</label>
                <input type="file" accept="image/*" onChange={uploadQr} />

                <div className="qr preview">
                  {qrPix ? <img src={qrPix} alt="QR Pix" /> : <span>Prévia do QR Code</span>}
                </div>

                <button className="primary" onClick={savePix}>Salvar Pix</button>
              </div>

              <div className="admin-box">
                <h3>Vendas registradas</h3>
                {orders.length === 0 && <p>Nenhuma venda registrada ainda.</p>}
                <div className="orders">
                  {orders.map((order, index) => (
                    <div key={index}>{order}</div>
                  ))}
                </div>
              </div>
            </div>

            <p className="note">
              Painel local: Pix, QR Code e vendas ficam salvos neste navegador. Para salvar em todos os celulares/computadores, precisa banco de dados.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
