
import { useEffect, useState } from "react";
import {
  FaDiscord,
  FaUsers,
  FaPaintBrush,
  FaCrown,
  FaShoppingCart,
} from "react-icons/fa";

const products = [
  { name: "100 membros mistos", price: 4, icon: <FaUsers /> },
  { name: "100 membros reais", price: 5, icon: <FaUsers /> },
  { name: "100 membros premium", price: 9, icon: <FaUsers /> },
  { name: "100 membros online", price: 10, icon: <FaUsers /> },
  { name: "Nitro Discord", price: 6.5, icon: <FaCrown /> },
  { name: "Designer servidor", price: 65, icon: <FaPaintBrush /> },
];

export default function App() {
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [orders, setOrders] = useState([]);
  const [pixKey, setPixKey] = useState(localStorage.getItem("pixKey") || "000.000.000-00");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(saved);
  }, []);

  const total = selected ? (selected.price * qty).toFixed(2) : "0.00";

  const finishOrder = () => {
    const order = {
      product: selected.name,
      qty,
      total,
      date: new Date().toLocaleString(),
    };

    const updated = [...orders, order];
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));

    alert("Pedido criado com sucesso!");
    window.open("https://discord.com", "_blank");
    setSelected(null);
  };

  const adminLogin = () => {
    const password = prompt("Digite a senha admin:");
    if (password === "admtauros") {
      setIsAdmin(true);
      alert("Login admin realizado!");
    } else {
      alert("Senha incorreta.");
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>STORE TAUROS</h1>

        <button>Início</button>
        <button>Produtos</button>
        <button onClick={() => window.open("https://discord.com", "_blank")}>
          Discord
        </button>
        <button>Pix</button>
        <button>Suporte</button>

        <div className="admin-box">
          <button onClick={adminLogin}>Painel Admin</button>
        </div>
      </aside>

      <main className="main">
        <section className="hero">
          <div>
            <h2>Bem-vindo(a) à</h2>
            <h1>Store Tauros</h1>
            <p>
              Loja premium digital com membros, nitro, designer e produtos para Discord.
            </p>
          </div>

          <img src="/assets/background-exato.png" alt="Tauros" />
        </section>

        <section className="products">
          {products.map((item, index) => (
            <div className="card" key={index} onClick={() => setSelected(item)}>
              <div className="icon">{item.icon}</div>
              <h3>{item.name}</h3>
              <p>R${item.price.toFixed(2)}</p>
              <button>
                <FaShoppingCart />
              </button>
            </div>
          ))}
        </section>

        <section className="orders">
          <h2>Meus pedidos</h2>

          {orders.length === 0 ? (
            <p>Nenhum pedido.</p>
          ) : (
            orders.map((o, i) => (
              <div key={i} className="order-item">
                {o.product} - {o.qty}x - R${o.total}
              </div>
            ))
          )}
        </section>

        {isAdmin && (
          <section className="admin-panel">
            <h2>Painel Admin</h2>

            <input
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="Chave Pix"
            />

            <button
              onClick={() => {
                localStorage.setItem("pixKey", pixKey);
                alert("Chave Pix salva!");
              }}
            >
              Salvar chave Pix
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("orders");
                setOrders([]);
              }}
            >
              Limpar vendas
            </button>
          </section>
        )}
      </main>

      {selected && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selected.name}</h2>

            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />

            <h3>Total: R${total}</h3>

            <div className="pix-box">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIXTAUROS"
                alt="QR Pix"
              />

              <p>Pix: {pixKey}</p>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(pixKey);
                  alert("Pix copiado!");
                }}
              >
                Copiar chave Pix
              </button>
            </div>

            <button className="confirm" onClick={finishOrder}>
              Confirmar pagamento
            </button>

            <button className="close" onClick={() => setSelected(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
