import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Flex, IconButton, Grid, GridItem, Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Agendamentos = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyCounts, setMonthlyCounts] = useState<{ month: number, count: number }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMonthlyCounts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/agendamentos/monthly-count/${year}`);
        setMonthlyCounts(response.data);
      } catch (error) {
        console.error('Erro ao buscar contagem mensal de agendamentos:', error);
      }
    };

    fetchMonthlyCounts();
  }, [year]);

  const handleYearChange = (change: number) => {
    setYear(prevYear => prevYear + change);
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <Container maxW="container.lg" p={4}>
      <Box>
        <Heading>Agendamentos</Heading>
        <Flex align="center" justify="center" mt={4}>
          <IconButton
            aria-label="Previous Year"
            icon={<ChevronLeftIcon />}
            onClick={() => handleYearChange(-1)}
          />
          <Heading mx={4}>{year}</Heading>
          <IconButton
            aria-label="Next Year"
            icon={<ChevronRightIcon />}
            onClick={() => handleYearChange(1)}
          />
        </Flex>
        <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={4}>
          {months.map((month, index) => (
            <GridItem key={index} p={4} borderWidth={1} borderRadius="lg" textAlign="center">
              <Button
                width="full"
                onClick={() => navigate(`/agendamentos/${year}/${index + 1}`)}
              >
                <Heading size="md">{month}</Heading>
                <Box mt={2}>Consultas: {monthlyCounts[index]?.count || 0}</Box>
              </Button>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Agendamentos;
