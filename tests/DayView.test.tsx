import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DayView from '../src/components/agendamentos/DayView';
import { ChakraProvider } from '@chakra-ui/react';

const mockData = [
  {
    idAgendamento: 1,
    nomeDoPaciente: 'John Doe',
    dataNascimentoPaciente: new Date('1990-01-01'),
    dataHoraAgendamento: new Date('2024-07-15T10:00:00'),
    estadoDoAgendamento: false,
    conclusaoDoAgendamento: false,
  },
  {
    idAgendamento: 2,
    nomeDoPaciente: 'Jane Smith',
    dataNascimentoPaciente: new Date('1985-05-20'),
    dataHoraAgendamento: new Date('2024-07-15T11:00:00'),
    estadoDoAgendamento: true,
    conclusaoDoAgendamento: true,
  },
  // Adicione mais consultas para teste aqui
];

describe('DayView', () => {
  test('renderiza o nome do paciente corretamente', () => {
    render(
      <ChakraProvider>
        <DayView data={mockData} onUpdate={() => {}} />
      </ChakraProvider>
    );

    expect(screen.getByText('Nome do Paciente: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Nome do Paciente: Jane Smith')).toBeInTheDocument();
  });

  test('renderiza os grupos de consultas corretamente', () => {
    render(
      <ChakraProvider>
        <DayView data={mockData} onUpdate={() => {}} />
      </ChakraProvider>
    );

    expect(screen.getByText('15/7/2024 10:00')).toBeInTheDocument();
    expect(screen.getByText('15/7/2024 11:00')).toBeInTheDocument();
  });

  test('abre o modal de edição ao clicar no botão "Editar"', () => {
    render(
      <ChakraProvider>
        <DayView data={mockData} onUpdate={() => {}} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getAllByText('Editar')[0]);

    expect(screen.getByText('Editar Consulta')).toBeInTheDocument();
  });

  test('abre o modal de edição ao clicar no botão "Editar" para diferentes consultas', () => {
    render(
      <ChakraProvider>
        <DayView data={mockData} onUpdate={() => {}} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getAllByText('Editar')[1]);
    expect(screen.getByText('Editar Consulta')).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('Jane Smith'))).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancelar'));

    fireEvent.click(screen.getAllByText('Editar')[0]);
    expect(screen.getByText('Editar Consulta')).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('John Doe'))).toBeInTheDocument();
  });

  test('fecha o modal de edição sem salvar', async () => {
    render(
      <ChakraProvider>
        <DayView data={mockData} onUpdate={() => {}} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getAllByText('Editar')[0]);
    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.queryByText('Editar Consulta')).not.toBeInTheDocument();
    });
  });

  test('chama a função onUpdate após editar uma consulta', async () => {
    const mockOnUpdate = jest.fn();

    render(
      <ChakraProvider>
        <DayView data={mockData} onUpdate={mockOnUpdate} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getAllByText('Editar')[0]);
    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });
});
