// Path: PitangProjeto/frontend/tests/MonthView.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MonthView from '../src/components/agendamentos/MonthView';

const mockData = [
  { day: 1, count: 2 },
  { day: 2, count: 5 },
  { day: 3, count: 8 },
];

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const month = 7;
const year = 2024;

describe('MonthView', () => {
  test('renderiza corretamente os dias do mês', () => {
    render(
      <BrowserRouter>
        <MonthView 
          data={mockData} 
          month={month} 
          year={year} 
          dayNames={dayNames} 
          setView={() => {}} 
          setDay={() => {}} 
        />
      </BrowserRouter>
    );

    // Verifica se os títulos dos dias da semana estão presentes
    dayNames.forEach(dayName => {
      expect(screen.getByText(dayName)).toBeInTheDocument();
    });

    // Verifica se os dias do mês são renderizados corretamente
    mockData.forEach(({ day }) => {
      expect(screen.getByText(`Dia ${day}`)).toBeInTheDocument();
    });

    // Verifica se os contadores de agendamentos estão corretos
    mockData.forEach(({ day, count }) => {
      expect(screen.getByText(`Agendamentos: ${count}`)).toBeInTheDocument();
    });

    // Verifica se os dias vazios são renderizados corretamente
    const emptyDays = screen.getAllByText('', { exact: false });
    expect(emptyDays.length).toBeGreaterThan(0);
  });

  test('muda a visualização e define o dia ao clicar no card do dia', () => {
    const setViewMock = jest.fn();
    const setDayMock = jest.fn();

    render(
      <BrowserRouter>
        <MonthView 
          data={mockData} 
          month={month} 
          year={year} 
          dayNames={dayNames} 
          setView={setViewMock} 
          setDay={setDayMock} 
        />
      </BrowserRouter>
    );

    // Simula o clique no card do dia 1
    const dayCard = screen.getByText('Dia 1');
    fireEvent.click(dayCard);

    expect(setViewMock).toHaveBeenCalledWith('Dia');
    expect(setDayMock).toHaveBeenCalledWith(1);
  });

  // Insira mais testes aqui futuramente
});
