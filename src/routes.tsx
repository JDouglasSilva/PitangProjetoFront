// frontend/src/routes.tsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Agendamentos from './pages/Agendamentos';
import Formulario from './pages/Formulario';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendamentos" element={<Agendamentos />} />
      <Route path="/formulario" element={<Formulario />} />
    </Routes>
  );
};

export default AppRoutes;
