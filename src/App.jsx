
import React, { useState } from "react";

const discord = "https://discord.gg/WPH5Xc58cm";

const categorias = [
  {
    titulo:"Membros Mistos",
    preco:"R$ 2,00 / 100",
    cor:"mistos",
    opcoes:["100","200","300","400","5000"]
  },
  {
    titulo:"Membros Reais",
    preco:"R$ 2,50 / 100",
    cor:"reais",
    opcoes:["100","200","300","400","5000"]
  },
  {
    titulo:"Membros Premium",
    preco:"R$ 6,50 / 100",
    cor:"premium",
    opcoes:["100","200","300","400","5000"]
  },
  {
    titulo:"Designer de Servidor",
    preco:"R$ 35,00",
    cor:"designer",
    opcoes:["Pacote Único"]
  },
  {
    titulo:"Conta Nitrada",
    preco:"R$ 5,00",
    cor:"nitro",
    opcoes:["1 Conta","5 Contas","10 Contas"]
  }
];

export default function App(){
  const [pix,setPix] = useState(localStorage.getItem("pix") || "000.000.000-00");
  const [admin,setAdmin] = useState(false);
  const [senha,setSenha] = useState("");
  const [confirmado,setConfirmado] = useState(false);

  function loginAdmin(){
    if(senha === "admtauros"){
      setAdmin(true);
    } else {
      alert("Senha incorreta");
    }
  }

  function salvarPix(){
    localStorage.setItem("pix", pix);
    alert("Chave PIX salva!");
  }

  return(
    <div className="layout">

      <aside className="sidebar">
        <div className="logo">
          <div className="bull">🐂</div>
          <span>STORETAUROS</span>
        </div>

        <button>🏠</button>
        <button>🛒</button>
        <button>💬</button>
        <button onClick={()=>setAdmin(true)}>⚙️</button>
      </aside>

      <main className="content">

        <section className="hero">
          <div className="overlay"></div>

          <div className="heroText">
            <span className="badge">LOJA PREMIUM DISCORD</span>

            <h1>STORETAUROS</h1>

            <h2>
              MEMBROS, DESIGNER E CONTAS NITRADAS
            </h2>

            <p>
              Loja profissional com entrega rápida, suporte ativo e pagamento via PIX.
            </p>

            <div className="heroButtons">
              <button>VER PRODUTOS</button>
              <button className="secondary">SUPORTE</button>
            </div>

            <div className="infos">
              <div>⚡ Entrega imediata</div>
              <div>💎 Qualidade premium</div>
              <div>🛡️ Compra segura</div>
            </div>
          </div>
        </section>

        <section className="pixBox">
          <div>
            <h3>PAGAMENTO VIA PIX</h3>
            <p>Chave única cadastrada pelo administrador</p>
          </div>

          <div className="pixKey">{pix}</div>
        </section>

        <h2 className="sectionTitle">PRODUTOS</h2>

        <section className="cards">

          {categorias.map((item,index)=>(
            <div className={`card ${item.cor}`} key={index}>

              <div className="cardImage"></div>

              <div className="cardContent">

                <span className="smallTag">STORETAUROS</span>

                <h3>{item.titulo}</h3>

                <strong>{item.preco}</strong>

                <select>
                  {item.opcoes.map((op,i)=>(
                    <option key={i}>{op}</option>
                  ))}
                </select>

                <div className="buttons">
                  <button
                    onClick={()=>{
                      navigator.clipboard.writeText(pix);
                      alert("PIX copiado!");
                    }}
                  >
                    COPIAR PIX
                  </button>

                  <button
                    className="buy"
                    onClick={()=>setConfirmado(true)}
                  >
                    COMPRAR
                  </button>
                </div>

                {confirmado && (
                  <div className="confirm">
                    <span>✅ Pagamento confirmado!</span>

                    <a href={discord} target="_blank">
                      ABRIR DISCORD
                    </a>
                  </div>
                )}

              </div>
            </div>
          ))}

        </section>

        {!admin && (
          <section className="adminLogin">

            <h2>PAINEL ADMIN</h2>

            <input
              type="password"
              placeholder="Senha admin"
              onChange={(e)=>setSenha(e.target.value)}
            />

            <button onClick={loginAdmin}>
              ENTRAR
            </button>

          </section>
        )}

        {admin && (
          <section className="adminPanel">

            <h2>CONFIGURAÇÕES ADMIN</h2>

            <div className="adminGrid">

              <div className="adminCard">
                <h3>Chave PIX</h3>

                <input
                  value={pix}
                  onChange={(e)=>setPix(e.target.value)}
                />

                <button onClick={salvarPix}>
                  SALVAR
                </button>
              </div>

              <div className="adminCard">
                <h3>Vendas</h3>

                <div className="sale">#001 Membros Premium</div>
                <div className="sale">#002 Conta Nitrada</div>
                <div className="sale">#003 Designer Server</div>
              </div>

              <div className="adminCard">
                <h3>Suporte</h3>

                <p>Discord integrado</p>

                <a className="supportBtn" href={discord} target="_blank">
                  Abrir suporte
                </a>
              </div>

            </div>

          </section>
        )}

      </main>
    </div>
  )
}
