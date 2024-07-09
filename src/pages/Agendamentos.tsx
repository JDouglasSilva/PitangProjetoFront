import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Flex, IconButton, Grid, GridItem, Button, Text } from '@chakra-ui/react';
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
      <Box textAlign="center" mb={6}>
        <Heading color="green.800">Agendamentos</Heading>
        <Flex align="center" justify="center" mt={4}>
          <IconButton
            aria-label="Previous Year"
            icon={<ChevronLeftIcon />}
            onClick={() => handleYearChange(-1)}
            colorScheme="green"
          />
          <Heading mx={4} color="green.800">{year}</Heading>
          <IconButton
            aria-label="Next Year"
            icon={<ChevronRightIcon />}
            onClick={() => handleYearChange(1)}
            colorScheme="green"
          />
        </Flex>
      </Box>
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)', xl: 'repeat(7, 1fr)' }} gap={4}>
        {months.map((month, index) => (
          <GridItem key={index} p={2} borderWidth={1} borderRadius="lg" textAlign="center" boxShadow="md">
            <Button
              width="full"
              onClick={() => navigate(`/agendamentos/${year}/${index + 1}`)}
              colorScheme="green"
              variant="outline"
              height="auto"
              p={4}
            >
              <Box>
                <Heading size="md">{month}</Heading>
                <Text mt={2}>Consultas: {monthlyCounts[index]?.count || 0}</Text>
              </Box>
            </Button>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default Agendamentos;
