import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Grid, GridItem } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MesDetalhes = () => {
  const { year, month } = useParams();
  const [dailyCounts, setDailyCounts] = useState<{ day: number, count: number }[]>([]);

  useEffect(() => {
    const fetchDailyCounts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/agendamentos/daily-count/${year}/${month}`);
        setDailyCounts(response.data);
      } catch (error) {
        console.error('Erro ao buscar contagem diária de agendamentos:', error);
      }
    };

    fetchDailyCounts();
  }, [year, month]);

  return (
    <Container maxW="container.lg" p={4}>
      <Heading mb={6}>Agendamentos de {month}/{year}</Heading>
      <Grid templateColumns="repeat(7, 1fr)" gap={6}>
        {dailyCounts.map((dayInfo, index) => (
          <GridItem key={index} p={4} borderWidth={1} borderRadius="lg" textAlign="center">
            <Heading size="md">Dia {dayInfo.day}</Heading>
            <Box mt={2}>Consultas: {dayInfo.count}</Box>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default MesDetalhes;
