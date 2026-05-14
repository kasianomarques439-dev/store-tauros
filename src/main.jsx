
import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'

function App(){
  return (
    <div className="bg">
      <div className="overlay">
        <h1>Store Tauros</h1>
        <p>Projeto corrigido com plugin React funcionando.</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
