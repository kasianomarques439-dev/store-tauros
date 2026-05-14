
import React,{useState}from"react";

const DISCORD="https://discord.gg/WPH5Xc58cm";
const ADMIN_PASS="admtauros";

const produtos=[
 {nome:"Membros Mistos",tipo:"mistos",base:2,desc:"Membros mistos para movimentar seu servidor Discord.",img:"https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1200&auto=format&fit=crop"},
 {nome:"Membros Reais",tipo:"reais",base:2.5,desc:"Membros reais e ativos para aumentar seu servidor.",img:"https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"},
 {nome:"Membros Premium",tipo:"premium",base:6.5,desc:"Membros premium com mais qualidade e retenção.",img:"https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1200&auto=format&fit=crop"},
 {nome:"Designer de Server",tipo:"designer",fixo:35,desc:"Design profissional: cargos, canais, decoração e organização.",img:"https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop"},
 {nome:"Conta Nitrada",tipo:"nitro",fixo:5,desc:"Conta nitrada com resgate diretamente pelo ticket.",img:"https://images.unsplash.com/photo-1614294148960-9aa740632a87?q=80&w=1200&auto=format&fit=crop"}
];

const quantidades=[100,200,300,400,5000];

export default function App(){
 const[modal,setModal]=useState(null);
 const[confirmado,setConfirmado]=useState(false);
 const[menu,setMenu]=useState(false);
 const[adminLogin,setAdminLogin]=useState(false);
 const[admin,setAdmin]=useState(false);
 const[senha,setSenha]=useState("");
 const[pix,setPix]=useState(localStorage.getItem("pixKey")||"Cadastre sua chave Pix no painel admin");
 const[qr,setQr]=useState(localStorage.getItem("pixQr")||"");
 const[vendas,setVendas]=useState(()=>JSON.parse(localStorage.getItem("vendas")||"[]"));

 function money(v){return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
 function abrirCompra(p,q=null){
   const preco=p.fixo?money(p.fixo):money((q/100)*p.base);
   const nome=p.fixo?p.nome:`${q.toLocaleString("pt-BR")} ${p.nome}`;
   setModal({...p,nomeFinal:nome,precoFinal:preco,quantidade:q});
   setConfirmado(false);
 }
 function confirmar(){
   const venda=`${modal.nomeFinal} - ${modal.precoFinal} - ${new Date().toLocaleString("pt-BR")}`;
   const nv=[venda,...vendas];
   setVendas(nv);localStorage.setItem("vendas",JSON.stringify(nv));setConfirmado(true);
 }
 function login(){
   if(senha===ADMIN_PASS){setAdminLogin(false);setAdmin(true);setSenha("")}
   else alert("Chave admin incorreta!");
 }
 function salvarPix(){localStorage.setItem("pixKey",pix);localStorage.setItem("pixQr",qr);alert("Pix e QR salvos!")}
 function uploadQR(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setQr(String(r.result));r.readAsDataURL(f)}
 function copiarPix(){navigator.clipboard.writeText(pix);alert("Pix copiado!")}

 return <div className="app">
  <aside className="side">
   <div className="logo"><div className="logoImg"></div><b>STORE<br/><span>TAUROS</span></b></div>
   <button onClick={()=>setMenu(true)}>☰</button><a href="#inicio">⌂</a><a href="#produtos">▣</a><a href="#pix">◆</a><button onClick={()=>setAdminLogin(true)}>⚙</button>
  </aside>

  <main>
   <header className="top">
    <button onClick={()=>setMenu(true)} className="dots">•••</button>
    <h1>STORE<span>TAUROS</span></h1>
    <button onClick={()=>setAdminLogin(true)} className="adminBtn">Área do Admin</button>
   </header>

   <section id="inicio" className="hero">
    <div className="heroText">
     <small>A MELHOR STORE PARA DISCORD</small>
     <h2>Turbine seu Discord com a <span>StoreTauros</span></h2>
     <p>Membros, designer de servidor e contas nitradas com pagamento via Pix e resgate pelo Discord.</p>
     <div className="actions"><a href="#produtos">Ver produtos</a><button onClick={()=>window.open(DISCORD,"_blank")}>Abrir ticket</button></div>
    </div>
    <div className="support"><b>Suporte via Discord</b><p>Após pagar, clique para resgatar no ticket.</p><button onClick={()=>window.open(DISCORD,"_blank")}>Abrir Discord</button></div>
   </section>

   <section className="benefits"><div>⚡<b>Entrega</b><span>via ticket</span></div><div>💠<b>Pagamento</b><span>Pix/QR</span></div><div>🛡️<b>Seguro</b><span>100%</span></div><div>🎧<b>Suporte</b><span>Discord</span></div></section>

   <section id="produtos" className="produtos">
    <h2>Categorias</h2>
    <div className="grid">
     {produtos.map((p)=> <article className={"card "+p.tipo} key={p.nome}>
      <div className="img" style={{backgroundImage:`url(${p.img})`}}><span>{p.nome}</span></div>
      <div className="body">
       <h3>{p.nome}</h3><p>{p.desc}</p>
       {p.fixo ? <>
        <strong>{money(p.fixo)}</strong>
        <button onClick={()=>abrirCompra(p)}>Comprar agora</button>
       </> : <>
        <select onChange={(e)=>abrirCompra(p,Number(e.target.value))} defaultValue="">
         <option value="" disabled>Selecione a quantidade</option>
         {quantidades.map(q=><option key={q} value={q}>{q.toLocaleString("pt-BR")} membros - {money((q/100)*p.base)}</option>)}
        </select>
        <button onClick={()=>abrirCompra(p,100)}>Comprar 100 membros</button>
       </>}
      </div>
     </article>)}
    </div>
   </section>

   <section id="pix" className="pix">
    <div><h2>Pagamento via Pix</h2><p>Chave Pix única cadastrada pelo admin.</p></div>
    <div className="pixKey"><b>{pix}</b><button onClick={copiarPix}>Copiar</button></div>
    <div className="qrBox">{qr?<img src={qr}/>:<span>QR Pix aparecerá aqui</span>}</div>
   </section>

   <footer>© 2026 StoreTauros — resgate pelo Discord: {DISCORD}</footer>
  </main>

  {menu&&<div className="modalBg"><div className="menuBox"><button className="close" onClick={()=>setMenu(false)}>×</button><h2>Menu</h2><a href="#inicio" onClick={()=>setMenu(false)}>Início</a><a href="#produtos" onClick={()=>setMenu(false)}>Produtos</a><a href="#pix" onClick={()=>setMenu(false)}>Pix</a><button onClick={()=>window.open(DISCORD,"_blank")}>Discord</button></div></div>}

  {modal&&<div className="modalBg"><div className="modal"><button className="close" onClick={()=>setModal(null)}>×</button>
   <img className="modalImg" src={modal.img}/><h2>{modal.nomeFinal}</h2><p>{modal.desc}</p><strong className="price">{modal.precoFinal}</strong>
   <div className="pay"><h3>Pix / QR para pagamento</h3><p>{pix}</p><button onClick={copiarPix}>Copiar Pix</button>{qr&&<img src={qr}/>}</div>
   {!confirmado?<button className="confirm" onClick={confirmar}>Já paguei, confirmar pagamento</button>:<div className="ok"><h3>✅ Pagamento confirmado!</h3><p>Agora resgate seu pedido no Discord.</p><a href={DISCORD} target="_blank">Abrir Discord para resgatar</a></div>}
  </div></div>}

  {adminLogin&&<div className="modalBg"><div className="modal small"><button className="close" onClick={()=>setAdminLogin(false)}>×</button><h2>Área privada admin</h2><input type="password" placeholder="Chave: admtauros" value={senha} onChange={e=>setSenha(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/><button className="confirm" onClick={login}>Entrar</button></div></div>}

  {admin&&<div className="modalBg"><div className="modal adminPanel"><button className="close" onClick={()=>setAdmin(false)}>×</button><h2>Configurações Admin</h2>
   <div className="adminGrid"><section><h3>Chave Pix única</h3><input value={pix} onChange={e=>setPix(e.target.value)}/><h3>QR Code Pix</h3><input type="file" accept="image/*" onChange={uploadQR}/><button onClick={salvarPix}>Salvar Pix/QR</button>{qr&&<img className="preview" src={qr}/>}</section>
   <section><h3>Painel de vendas</h3><div className="sales">{vendas.length===0?<span>Nenhuma venda registrada.</span>:vendas.map((v,i)=><div key={i}>{v}</div>)}</div><button onClick={()=>{setVendas([]);localStorage.removeItem("vendas")}}>Limpar vendas</button></section>
   <section><h3>Discord de resgate</h3><p>{DISCORD}</p><button onClick={()=>window.open(DISCORD,"_blank")}>Abrir Discord</button></section></div>
  </div></div>}
 </div>
}
