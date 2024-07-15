// Path: PitangProjeto/frontend/tests/Formulario.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import Formulario from '../src/pages/Formulario';

describe('Formulario', () => {
  test('Renderiza título "Agendar Vacina"', () => {
    render(
      <ChakraProvider>
        <BrowserRouter>
          <Formulario />
        </BrowserRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('Agendar Vacina')).toBeInTheDocument();
  });
});
