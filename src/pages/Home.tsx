import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <ul>
          <li><Link to="/agendamentos">Agendamentos</Link></li>
          <li><Link to="/formulario">Formulário</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;