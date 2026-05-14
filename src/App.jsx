
import React,{useState} from "react";

const discord = "https://discord.gg/WPH5Xc58cm";

const produtos = [
{
nome:"Membros Mistos",
valor:"R$2,00 / 100",
img:"https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
},
{
nome:"Membros Reais",
valor:"R$2,50 / 100",
img:"https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop"
},
{
nome:"Membros Premium",
valor:"R$6,50 / 100",
img:"https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1200&auto=format&fit=crop"
},
{
nome:"Designer de Server",
valor:"R$35,00",
img:"https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop"
},
{
nome:"Conta Nitrada",
valor:"R$5,00",
img:"https://images.unsplash.com/photo-1614294148960-9aa740632a87?q=80&w=1200&auto=format&fit=crop"
}
];

export default function App(){

const [admin,setAdmin]=useState(false);
const [senha,setSenha]=useState("");
const [pix,setPix]=useState(localStorage.getItem("pix") || "");
const [qr,setQr]=useState(localStorage.getItem("qr") || "");
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
localStorage.setItem("qr",qr);
alert("Configurações salvas!");
}

return(
<div className="app">

<aside className="sidebar">
<div className="logo">
🐂
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

<span className="badge">
STORETAUROS
</span>

<h1>
A MELHOR STORE PARA DISCORD
</h1>

<p>
Membros, designer, conta nitrada e suporte premium.
</p>

<div className="heroButtons">
<button>VER PRODUTOS</button>
<button className="secondary">SUPORTE</button>
</div>

</div>
</section>

<h2 className="title">
Produtos
</h2>

<section className="grid">

{produtos.map((p,i)=>(
<div className="card" key={i}>

<div 
className="cardImage"
style={{backgroundImage:`url(${p.img})`}}
></div>

<div className="cardContent">

<h3>{p.nome}</h3>

<strong>{p.valor}</strong>

<button 
onClick={()=>{
setConfirmado(true);
}}
>
Comprar
</button>

{confirmado && (
<div className="confirm">

<span>
✅ Pagamento confirmado
</span>

<a href={discord} target="_blank">
Abrir Discord
</a>

</div>
)}

</div>

</div>
))}

</section>

<section className="adminPanel">

<h2>Área Admin</h2>

<input 
placeholder="Senha admin"
onChange={(e)=>setSenha(e.target.value)}
/>

<button onClick={entrar}>
Entrar
</button>

{admin && (
<div className="configs">

<h3>Configurações PIX</h3>

<input 
placeholder="Chave PIX"
value={pix}
onChange={(e)=>setPix(e.target.value)}
/>

<input 
placeholder="QR PIX"
value={qr}
onChange={(e)=>setQr(e.target.value)}
/>

<button onClick={salvar}>
Salvar PIX
</button>

<div className="discordBox">

<h3>Discord de resgate</h3>

<a href={discord} target="_blank">
Abrir Discord
</a>

</div>

</div>
)}

</section>

</main>

</div>
)
}
