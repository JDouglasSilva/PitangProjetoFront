import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import AgendamentoForm from '../src/components/formulario/AgendamentoForm';

describe('AgendamentoForm', () => {
  test('Renderiza corretamente o título do formulário', () => {
    render(
      <ChakraProvider>
        <AgendamentoForm
          onSubmit={() => {}}
          saveFormData={() => {}}
          setAgendamentoInfo={() => {}}
          setIsModalOpen={() => {}}
        />
      </ChakraProvider>
    );

    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Data de Nascimento')).toBeInTheDocument();
    expect(screen.getByText('Dia do Agendamento')).toBeInTheDocument();
    expect(screen.getByText('Hora do Agendamento')).toBeInTheDocument();
  });

  test('Permite a inserção do nome', async () => {
    render(
      <ChakraProvider>
        <AgendamentoForm
          onSubmit={() => {}}
          saveFormData={() => {}}
          setAgendamentoInfo={() => {}}
          setIsModalOpen={() => {}}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'John Doe' } });
    expect(screen.getByPlaceholderText('Nome')).toHaveValue('John Doe');
  });


    //Devido a usar um coponente personalizado muito especifico, tive dificuldade em realizar os seguintes testes:
    
    // Simular a seleção da data de nascimento
    // Simular a seleção do dia do agendamento
    // Simular a seleção da hora do agendamento
    // Simular submição do fromulario
});
