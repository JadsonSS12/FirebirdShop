import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';


import illustration from '../assets/idea.png'; 
import ilu from '../assets/react.svg'; 


const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">
          <img src={ilu} alt="Reception desk with guests" />
        </div>
        <nav className="main-nav">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link active">Page</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">See More</a>
        </nav>
      </header>

      <main className="home-content">
        <section className="text-section">
          <h4 className="eyebrow-text">FireBird Shop</h4>
          <h1 className="main-heading">Seja Muito Bem-Vindo</h1>
          <p className="description">
            Este é um projeto criado como meio de avaliação de aprendizado na disciplina de Banco de Dados, ministrada pelo professor Dr. Dimas Cassimiro.
              </p>
        <Link to='/dashboard'>
          <button className="cta-button">
            Vamos lá!
          </button>
          </Link>
        </section>

        <section className="image-section">
          <img src={illustration} alt="Reception desk with guests" />
        </section>
      </main>
    </div>
    
  );
};

export default HomePage;