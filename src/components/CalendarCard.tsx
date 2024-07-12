import React from 'react';
import { Box, Heading, Text, Progress } from '@chakra-ui/react';

interface CalendarCardProps {
  title: string;
  count: number;
  maxCount: number;
  onClick: () => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({ title, count, maxCount, onClick }) => {
  const getColorForProgress = (value: number) => {
    if (value < 50) return 'green';
    if (value < 75) return 'yellow';
    return 'red';
  };

  const progressValue = (count / maxCount) * 100;

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="lg"
      textAlign="center"
      boxShadow="md"
      cursor="pointer"
      onClick={onClick}
    >
      <Heading size="md">{title}</Heading>
      <Text mt={2}>Agendamentos: {count}</Text>
      <Progress
        value={progressValue}
        size="sm"
        colorScheme={getColorForProgress(progressValue)}
        mt={2}
      />
    </Box>
  );
};

export default CalendarCard;
