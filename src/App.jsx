import { useState } from 'react'

const produtos = [
  { nome: 'Membros Premium', preco: 'R$ 6,50' },
  { nome: 'Membros Online', preco: 'R$ 10,00' },
  { nome: 'Design de Servidor', preco: 'R$ 50,00' },
  { nome: 'Impulsos 2x', preco: 'R$ 3,50' },
  { nome: 'Impulsos 4x', preco: 'R$ 7,00' },
  { nome: 'Impulsos 8x', preco: 'R$ 10,50' },
  { nome: 'Impulsos 14x', preco: 'R$ 21,99' }
]

export default function App() {
  const [mensagem, setMensagem] = useState('')

  function comprar(nome) {
    setMensagem('Compra confirmada: ' + nome)
  }

  return (
    <div className="app">
      <div className="box">
        <h1>STORE TAUROS</h1>
        <p>Loja oficial Discord.</p>

        <div className="grid">
          {produtos.map((produto) => (
            <div className="card" key={produto.nome}>
              <h2>{produto.nome}</h2>
              <span>{produto.preco}</span>

              <button onClick={() => comprar(produto.nome)}>
                Comprar agora
              </button>
            </div>
          ))}
        </div>

        <div className="admin">
          <h2>Painel</h2>
          <p>ADM: stadm</p>
          <p>SUPORTE: sptauros</p>
        </div>

        {mensagem && <div className="msg">{mensagem}</div>}
      </div>
    </div>
  )
}
