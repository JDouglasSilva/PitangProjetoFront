// frontend/src/App.tsx

import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import AppRoutes from './routes';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <ChakraProvider>
      <Navbar />
      <AppRoutes />
    </ChakraProvider>
  );
};

export default App;
