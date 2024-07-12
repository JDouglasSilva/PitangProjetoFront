import React from 'react';
import { Grid, GridItem, Box, Heading, Text, Progress } from '@chakra-ui/react';
import CalendarCard from '../CalendarCard';

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

  for (let i = 0; i < startDay; i++) {
    days.push(<GridItem key={`empty-${i}`} />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayData = data.find(d => d.day === i) || { count: 0 };
    days.push(
      <GridItem key={i}>
        <CalendarCard
          title={`Dia ${i}`}
          count={dayData.count}
          maxCount={20}
          onClick={() => { setView('Dia'); setDay(i); }}
        />
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
