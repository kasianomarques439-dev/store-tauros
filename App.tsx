
import React from "react";

export default function App() {
  const products = [
    { name: "100 Membros Mistos", price: "R$ 2,00" },
    { name: "100 Membros Reais", price: "R$ 2,50" },
    { name: "500 Membros Discord", price: "R$ 6,50" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020617",
      color: "white",
      fontFamily: "Arial",
      padding: "20px"
    }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #0ea5e9",
        paddingBottom: "15px"
      }}>
        <h1 style={{
          color: "#38bdf8",
          fontSize: "40px"
        }}>
          STORE TAUROS
        </h1>

        <button style={{
          background: "#2563eb",
          border: "none",
          padding: "12px 25px",
          borderRadius: "12px",
          color: "white",
          cursor: "pointer"
        }}>
          Entrar
        </button>
      </header>

      <section style={{
        marginTop: "40px",
        padding: "40px",
        borderRadius: "25px",
        background: "linear-gradient(135deg,#031525,#0f172a)",
        border: "1px solid #0ea5e9"
      }}>
        <h2 style={{
          fontSize: "70px",
          marginBottom: "10px",
          color: "#38bdf8"
        }}>
          STORE TAUROS
        </h2>

        <p style={{
          fontSize: "22px",
          color: "#cbd5e1"
        }}>
          Qualidade, confiança e poder para seu Discord.
        </p>
      </section>

      <h2 style={{
        marginTop: "50px",
        marginBottom: "25px",
        color: "#38bdf8"
      }}>
        PRODUTOS
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: "20px"
      }}>
        {products.map((product) => (
          <div key={product.name} style={{
            background: "#0f172a",
            border: "1px solid #0ea5e9",
            borderRadius: "20px",
            padding: "25px"
          }}>
            <div style={{
              fontSize: "70px",
              textAlign: "center"
            }}>
              👥
            </div>

            <h3 style={{
              fontSize: "28px",
              textAlign: "center"
            }}>
              {product.name}
            </h3>

            <p style={{
              fontSize: "35px",
              textAlign: "center",
              color: "#22d3ee",
              fontWeight: "bold"
            }}>
              {product.price}
            </p>

            <button style={{
              width: "100%",
              marginTop: "15px",
              background: "#2563eb",
              border: "none",
              padding: "14px",
              borderRadius: "14px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}>
              COMPRAR
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
