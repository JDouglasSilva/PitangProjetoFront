import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Agendamentos from './pages/Agendamentos';
import Formulario from './pages/Formulario';
import MesDetalhes from './pages/MesDetalhes';  // Importar o novo componente

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/agendamentos/:year/:month" element={<MesDetalhes />} />  // Nova rota
      </Routes>
    </Router>
  );
};

export default AppRoutes;
