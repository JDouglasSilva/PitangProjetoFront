import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CustomDatePicker from '../src/components/CustomDatePicker';

describe('CustomDatePicker', () => {
  it('deve renderizar o componente corretamente', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <CustomDatePicker
        selected={null}
        onChange={handleChange}
      />
    );

    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('deve abrir o calendário ao focar no input', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <CustomDatePicker
        selected={null}
        onChange={handleChange}
      />
    );

    const input = container.querySelector('input');
    if (input) {
      fireEvent.focus(input);
    }

    const calendar = container.querySelector('.react-datepicker');
    expect(calendar).toBeInTheDocument();
  });

  it('deve desativar os dias passados corretamente', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <CustomDatePicker
        selected={null}
        onChange={handleChange}
        minDate={new Date()}
      />
    );

    const input = container.querySelector('input');
    if (input) {
      fireEvent.focus(input);
    }

    const pastDay = container.querySelector('.react-datepicker__day--001');
    expect(pastDay).toHaveClass('react-datepicker__day--disabled');
  });

  it('deve enviar a data selecionada corretamente via onChange', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <CustomDatePicker
        selected={null}
        onChange={handleChange}
      />
    );

    const input = container.querySelector('input');
    if (input) {
      fireEvent.focus(input);
    }

    const dayToSelect = container.querySelector('.react-datepicker__day--029');
    if (dayToSelect) {
      fireEvent.click(dayToSelect);
    }

    expect(handleChange).toHaveBeenCalled();
    const calledWithDate = handleChange.mock.calls[0][0];
    expect(calledWithDate).toBeInstanceOf(Date);
  });

  it('deve selecionar uma data corretamente', async () => {
    const handleChange = jest.fn();
    const { container } = render(
      <CustomDatePicker
        selected={null}
        onChange={handleChange}
      />
    );

    const input = container.querySelector('input');
    if (input) {
      fireEvent.focus(input);
    }

    const dayToSelect = container.querySelector('.react-datepicker__day--029');
    if (dayToSelect) {
      fireEvent.click(dayToSelect);
    }

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
      const selectedDate = handleChange.mock.calls[0][0];
      expect(selectedDate).toBeInstanceOf(Date);
      expect(selectedDate.getDate()).toBe(29);
    });
  });

  //Testes a serem feitos:
  // Teste para verificar se os dias cheios são desativados corretamente
  // Teste para verificar a interação com o servidor ao mudar o mês
  // Teste para verificar a renderização correta de dias cheios
});
