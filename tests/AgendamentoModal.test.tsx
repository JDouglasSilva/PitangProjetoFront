import React from 'react';
import { render, screen } from '@testing-library/react';
import AgendamentoModal from '../src/components/formulario/AgendamentoModal';
import { ChakraProvider } from '@chakra-ui/react';
import { format } from 'date-fns';

const mockAgendamentoInfo = {
  nomeDoPaciente: 'João da Silva',
  diaAgendamento: new Date('2024-07-29'),
  horaAgendamento: new Date('2024-07-29T10:00:00.000Z'),
};

describe('AgendamentoModal', () => {
  test('deve renderizar as informações corretamente', () => {
    const handleNovoAgendamento = jest.fn();
    const handleVerAgendamentos = jest.fn();
    const onClose = jest.fn();

    render(
      <ChakraProvider>
        <AgendamentoModal
          isOpen={true}
          onClose={onClose}
          agendamentoInfo={mockAgendamentoInfo}
          handleNovoAgendamento={handleNovoAgendamento}
          handleVerAgendamentos={handleVerAgendamentos}
        />
      </ChakraProvider>
    );

    expect(screen.getByText(/Nome do paciente: João da Silva/i)).toBeInTheDocument();
    expect(screen.getByText(`Data do agendamento: ${format(mockAgendamentoInfo.diaAgendamento, 'dd/MM/yyyy')}`)).toBeInTheDocument();
    expect(screen.getByText(`Horario do agendamento: ${format(mockAgendamentoInfo.horaAgendamento, 'HH:mm')}`)).toBeInTheDocument();
  });

  test('não deve renderizar se agendamentoInfo estiver ausente', () => {
    const handleNovoAgendamento = jest.fn();
    const handleVerAgendamentos = jest.fn();
    const onClose = jest.fn();

    render(
      <ChakraProvider>
        <AgendamentoModal
          isOpen={true}
          onClose={onClose}
          agendamentoInfo={null}
          handleNovoAgendamento={handleNovoAgendamento}
          handleVerAgendamentos={handleVerAgendamentos}
        />
      </ChakraProvider>
    );

    expect(screen.queryByText(/Nome do paciente:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Data do agendamento:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Horario do agendamento:/i)).not.toBeInTheDocument();
  });

// Teste para verificar se o botão "Realizar outro agendamento" funciona corretamente
// Teste para verificar se o botão "Ver agendamentos" funciona corretamente
// Teste para verificar se o modal não fecha ao clicar fora dele quando closeOnOverlayClick é false

});
