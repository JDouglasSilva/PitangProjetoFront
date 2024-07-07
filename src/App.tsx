import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './pages/Home';
import Agendamentos from './pages/Agendamentos';
import Formulario from './pages/Formulario';

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/formulario" element={<Formulario />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;