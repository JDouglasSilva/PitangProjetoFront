// frontend/tests/CalendarCard.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarCard from '../src/components/CalendarCard';
import { ChakraProvider } from '@chakra-ui/react';

describe('CalendarCard', () => {
  const defaultProps = {
    title: 'Test Title',
    count: 10,
    maxCount: 20,
    onClick: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(
      <ChakraProvider>
        <CalendarCard {...defaultProps} {...props} />
      </ChakraProvider>
    );
  };

  test('renders the component with the correct title', () => {
    renderComponent();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders the correct count of agendamentos', () => {
    renderComponent();
    expect(screen.getByText('Agendamentos: 10')).toBeInTheDocument();
  });

  test('calls onClick when the card is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Test Title'));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  test('renders the progress bar with correct value and color', () => {
    const { rerender } = renderComponent({ count: 5, maxCount: 20 });
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '25');

    rerender(
      <ChakraProvider>
        <CalendarCard {...defaultProps} count={15} maxCount={20} />
      </ChakraProvider>
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });
  
  // render da cor das barras de progresso
});

export {};
