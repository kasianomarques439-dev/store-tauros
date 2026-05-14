
import React, { useState } from "react";

const discord = "https://discord.gg/WPH5Xc58cm";

const planos = [
  { nome:"100 Membros Mistos", preco:"R$ 2,00"},
  { nome:"100 Membros Reais", preco:"R$ 2,50"},
  { nome:"100 Membros Premium", preco:"R$ 6,50"},
  { nome:"Designer de Server", preco:"R$ 35,00"},
  { nome:"Conta Nitrada", preco:"R$ 5,00"}
];

export default function App(){
  const [pix,setPix]=useState(localStorage.getItem("pix") || "SEU PIX");
  const [admin,setAdmin]=useState(false);
  const [senha,setSenha]=useState("");
  const [confirmado,setConfirmado]=useState(false);

  function entrar(){
    if(senha==="admtauros"){
      setAdmin(true);
    }else{
      alert("Senha incorreta");
    }
  }

  function salvar(){
    localStorage.setItem("pix",pix);
    alert("Pix salvo");
  }

  return(
    <div className="app">
      <aside className="sidebar">
        <h1>STORETAUROS</h1>
        <button>☰</button>
        <button>🏠</button>
        <button>🛒</button>
        <button onClick={()=>setAdmin(true)}>⚙️</button>
      </aside>

      <main className="content">
        <section className="hero">
          <div>
            <span className="tag">STORE DISCORD</span>
            <h2>PAINEL PROFISSIONAL STORETAUROS</h2>
            <p>Membros, designer e contas nitradas.</p>
          </div>
        </section>

        <h2 className="title">Categorias</h2>

        <div className="grid">
          {planos.map((p,i)=>(
            <div className="card" key={i}>
              <div className="image"></div>
              <h3>{p.nome}</h3>
              <strong>{p.preco}</strong>

              <div className="buttons">
                <button onClick={()=>navigator.clipboard.writeText(pix)}>Copiar Pix</button>
                <button onClick={()=>setConfirmado(true)}>Confirmar</button>
              </div>

              {confirmado && (
                <a className="discord" href={discord} target="_blank">
                  Abrir Discord
                </a>
              )}
            </div>
          ))}
        </div>

        {!admin && (
          <div className="adminlogin">
            <h2>Área Admin</h2>
            <input placeholder="Senha admin" onChange={(e)=>setSenha(e.target.value)} />
            <button onClick={entrar}>Entrar</button>
          </div>
        )}

        {admin && (
          <div className="admin">
            <h2>Painel Admin</h2>
            <p>Cadastre apenas uma chave pix:</p>
            <input value={pix} onChange={(e)=>setPix(e.target.value)} />
            <button onClick={salvar}>Salvar Pix</button>

            <div className="sales">
              <h3>Painel de vendas</h3>
              <div className="sale">Venda #001</div>
              <div className="sale">Venda #002</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
