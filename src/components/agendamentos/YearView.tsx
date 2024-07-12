import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import CalendarCard from '../CalendarCard';

interface YearViewProps {
  data: any[];
  monthNames: string[];
  setView: (view: 'Ano' | 'Mês' | 'Dia') => void;
  setMonth: (month: number) => void;
  year: number;
}

const YearView: React.FC<YearViewProps> = ({ data, monthNames, setView, setMonth, year }) => {
  return (
    <Grid templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
      {data.map((item, index) => {
        const daysInMonth = new Date(year, item.month, 0).getDate();
        const maxConsultations = daysInMonth * 20;
        return (
          <GridItem key={index}>
            <CalendarCard
              title={monthNames[item.month - 1]}
              count={item.count}
              maxCount={maxConsultations}
              onClick={() => { setView('Mês'); setMonth(item.month); }}
            />
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default YearView;
