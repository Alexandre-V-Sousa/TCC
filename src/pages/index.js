import React from 'react';

export default function HomePage() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: '#f9f9f9',
      minHeight: '100vh',
      padding: '40px'
    }}>
      <header style={{
        background: '#4CAF50',
        color: '#fff',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h1>Bem-vindo à Agro Patricia!</h1>
        <p>Sua loja de produtos agrícolas de confiança</p>
      </header>
      <section style={{
        marginTop: '40px',
        display: 'flex',
        gap: '32px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          maxWidth: '320px'
        }}>
          <h2>Produtos</h2>
          <ul>
            <li>Adubos e Fertilizantes</li>
            <li>Sementes selecionadas</li>
            <li>Ferramentas agrícolas</li>
            <li>Defensivos naturais</li>
          </ul>
        </div>
        <div style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          maxWidth: '320px'
        }}>
          <h2>Sobre nós</h2>
          <p>
            Somos apaixonados por agricultura e oferecemos os melhores produtos para o seu cultivo.
            Atendimento personalizado e entrega rápida!
          </p>
        </div>
      </section>
      <footer style={{
        marginTop: '60px',
        textAlign: 'center',
        color: '#888'
      }}>
        © {new Date().getFullYear()} Agro Patricia. Todos os direitos reservados.
      </footer>
    </div>
  );
}