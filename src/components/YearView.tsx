import React from 'react';
import { Grid, GridItem, Box, Heading, Text, Progress } from '@chakra-ui/react';

interface YearViewProps {
  data: any[];
  monthNames: string[];
  setView: (view: 'Ano' | 'Mês' | 'Dia') => void;
  setMonth: (month: number) => void;
  year: number;
}

const YearView: React.FC<YearViewProps> = ({ data, monthNames, setView, setMonth, year }) => {
  const getColorForProgress = (value: number) => {
    if (value < 50) return 'green';
    if (value < 75) return 'yellow';
    return 'red';
  };

  return (
    <Grid templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
      {data.map((item, index) => {
        const daysInMonth = new Date(year, item.month, 0).getDate();
        const maxConsultations = daysInMonth * 20;
        const progressValue = (item.count / maxConsultations) * 100;
        return (
          <GridItem
            key={index}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            textAlign="center"
            boxShadow="md"
            cursor="pointer"
            onClick={() => { setView('Mês'); setMonth(item.month); }}
          >
            <Box>
              <Heading size="md">{monthNames[item.month - 1]}</Heading>
              <Text mt={2}>Agendamentos: {item.count}</Text>
              <Progress
                value={progressValue}
                size="sm"
                colorScheme={getColorForProgress(progressValue)}
                mt={2}
              />
            </Box>
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default YearView;
