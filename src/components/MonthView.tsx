import React from 'react';
import { Grid, GridItem, Box, Heading, Text, Progress } from '@chakra-ui/react';

interface MonthViewProps {
  data: any[];
  month: number;
  year: number;
  dayNames: string[];
  setView: (view: 'Ano' | 'Mês' | 'Dia') => void;
  setDay: (day: number) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ data, month, year, dayNames, setView, setDay }) => {
  const startDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  const getColorForProgress = (value: number) => {
    if (value < 50) return 'green';
    if (value < 75) return 'yellow';
    return 'red';
  };

  for (let i = 0; i < startDay; i++) {
    days.push(<GridItem key={`empty-${i}`} />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayData = data.find(d => d.day === i) || { count: 0 };
    const progressValue = (dayData.count / 20) * 100;
    days.push(
      <GridItem
        key={i}
        p={2}
        borderWidth={1}
        borderRadius="lg"
        textAlign="center"
        boxShadow="md"
        cursor="pointer"
        onClick={() => { setView('Dia'); setDay(i); }}
      >
        <Box>
          <Heading size="sm">Dia {i}</Heading>
          <Text mt={2}>Agendamentos: {dayData.count}</Text>
          <Progress 
            value={progressValue} 
            size="sm" 
            colorScheme={getColorForProgress(progressValue)}
            mt={2} 
          />
        </Box>
      </GridItem>
    );
  }

  return (
    <Box>
      <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={4}>
        {dayNames.map((dayName, index) => (
          <GridItem key={index} textAlign="center" fontWeight="bold">{dayName}</GridItem>
        ))}
      </Grid>
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {days}
      </Grid>
    </Box>
  );
};

export default MonthView;
