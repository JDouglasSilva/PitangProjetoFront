// frontend/tests/Navbar.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  });

  test('renderiza Navbar com o texto correto', () => {
    expect(screen.getByText(/Portal Vacinação COVID-19/i)).toBeInTheDocument();
    expect(screen.getByText(/Faça seu agendamento/i)).toBeInTheDocument();
    expect(screen.getByText(/Consulte os agendamentos/i)).toBeInTheDocument();
  });

  test('renderiza Navbar com os links corretos', () => {
    const agendamentoLink = screen.getByRole('link', { name: /faça seu agendamento/i });
    const consultaLink = screen.getByRole('link', { name: /consulte os agendamentos/i });

    expect(agendamentoLink).toHaveAttribute('href', '/formulario');
    expect(consultaLink).toHaveAttribute('href', '/agendamentos');
  });

  test('a estrutura da Navbar está correta', () => {
    const headingLink = screen.getByRole('link', { name: /portal vacinação covid-19/i });
    expect(headingLink).toBeInTheDocument();

    const navButtons = screen.getAllByRole('link');
    expect(navButtons).toHaveLength(3);
  });
});
