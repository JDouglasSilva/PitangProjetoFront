import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../src/pages/Home';

describe('Home', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  });

  test('renderiza título corretamente', () => {
    const heading = screen.getByRole('heading', { name: /Bem-vindo ao Portal de Agendamento de Vacinas/i });
    expect(heading).toBeInTheDocument();
  });

  test('renderiza texto de introdução corretamente', () => {
    const introText = screen.getByText(/Diante do cenário atual, existe uma demanda gigante de pessoas para tomar a vacina para o COVID-19/i);
    expect(introText).toBeInTheDocument();
  });

  test('renderiza botão de agendamento com link correto', () => {
    const agendamentoButton = screen.getByRole('link', { name: /Faça seu agendamento/i });
    expect(agendamentoButton).toHaveAttribute('href', '/formulario');
  });

  test('renderiza botão de consulta de agendamentos com link correto', () => {
    const consultaButton = screen.getByRole('link', { name: /Consulte os agendamentos/i });
    expect(consultaButton).toHaveAttribute('href', '/agendamentos');
  });

  test('verifica a estrutura da página', () => {
    const heading = screen.getByRole('heading', { name: /Bem-vindo ao Portal de Agendamento de Vacinas/i });
    expect(heading).toBeInTheDocument();

    const introText = screen.getByText(/Diante do cenário atual, existe uma demanda gigante de pessoas para tomar a vacina para o COVID-19/i);
    expect(introText).toBeInTheDocument();

    const agendamentoButton = screen.getByRole('link', { name: /Faça seu agendamento/i });
    const consultaButton = screen.getByRole('link', { name: /Consulte os agendamentos/i });

    expect(agendamentoButton).toBeInTheDocument();
    expect(consultaButton).toBeInTheDocument();
  });
});
