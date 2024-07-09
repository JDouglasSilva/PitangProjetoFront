import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Grid, GridItem, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Interface
interface Consulta {
  nome: string;
  dataNascimento: string;
  dataHora: string;
}

const DiaDetalhes = () => {
  const { year, month, day } = useParams();
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/agendamentos/${year}/${month}/${day}`);
        setConsultas(response.data);
      } catch (error) {
        console.error('Erro ao buscar consultas:', error);
      }
    };

    fetchConsultas();
  }, [year, month, day]);

  return (
    <Container maxW="container.lg" p={4}>
      <Heading mb={6}>Consultas de {day}/{month}/{year}</Heading>
      <Grid templateColumns="repeat(1, 1fr)" gap={6}>
        {consultas.map((consulta, index) => (
          <GridItem key={index} p={4} borderWidth={1} borderRadius="lg" textAlign="center">
            <Text>Nome: {consulta.nome}</Text>
            <Text>Data de Nascimento: {new Date(consulta.dataNascimento).toLocaleDateString()}</Text>
            <Text>Horário: {new Date(consulta.dataHora).toLocaleTimeString()}</Text>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default DiaDetalhes;
