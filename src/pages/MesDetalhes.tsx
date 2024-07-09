import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Grid, GridItem, Button, Text } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MesDetalhes = () => {
  const { year, month } = useParams();
  const [dailyCounts, setDailyCounts] = useState<{ day: number, count: number }[]>([]);
  const navigate = useNavigate();

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
      <Heading mb={6} color="green.800">Agendamentos de {month}/{year}</Heading>
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)', xl: 'repeat(7, 1fr)' }} gap={4}>
        {dailyCounts.map((dayInfo, index) => (
          <GridItem key={index} p={2} borderWidth={1} borderRadius="lg" textAlign="center" boxShadow="md">
            <Button
              width="full"
              onClick={() => navigate(`/agendamentos/${year}/${month}/${dayInfo.day}`)}
              colorScheme="green"
              variant="outline"
              height="auto"
              p={4}
            >
              <Box>
                <Heading size="md">Dia {dayInfo.day}</Heading>
                <Text mt={2}>Consultas: {dayInfo.count}</Text>
              </Box>
            </Button>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default MesDetalhes;
