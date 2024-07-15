// Path: PitangProjeto/frontend/tests/YearView.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import YearView from '../src/components/agendamentos/YearView';

const mockData = [
  { month: 1, count: 10 },
  { month: 2, count: 20 },
  { month: 3, count: 15 },
];

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const year = 2024;

describe('YearView', () => {
  test('renderiza corretamente os meses do ano e verifica interações', () => {
    const setViewMock = jest.fn();
    const setMonthMock = jest.fn();

    render(
      <BrowserRouter>
        <YearView 
          data={mockData} 
          monthNames={monthNames} 
          setView={setViewMock} 
          setMonth={setMonthMock} 
          year={year} 
        />
      </BrowserRouter>
    );

    // Verifica se os meses do ano são renderizados corretamente
    mockData.forEach(({ month }) => {
      expect(screen.getByText(monthNames[month - 1])).toBeInTheDocument();
    });

    // Simula o clique no card do mês de Janeiro
    const januaryCard = screen.getByText('Janeiro');
    fireEvent.click(januaryCard);

    expect(setViewMock).toHaveBeenCalledWith('Mês');
    expect(setMonthMock).toHaveBeenCalledWith(1);

    // Verifica se os contadores de agendamentos estão corretos
    mockData.forEach(({ month, count }) => {
      expect(screen.getByText(`Agendamentos: ${count}`)).toBeInTheDocument();
    });
  });

  // Insira mais testes aqui futuramente
});
