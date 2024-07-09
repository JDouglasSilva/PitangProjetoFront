import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Grid, GridItem, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Consulta {
  nomeDoPaciente: string;
  dataNascimentoPaciente: string;
  dataHoraAgendamento: string;
  estadoDoAgendamento: boolean;
  conclusaoDoAgendamento: boolean;
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
      <Heading mb={4} color="green.800" mt={0}>Agendamentos de {day}/{month}/{year}</Heading>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
        {consultas.map((consulta, index) => (
          <GridItem key={index} p={4} borderWidth={1} borderRadius="lg" textAlign="center" boxShadow="md">
            <Box>
              <Heading size="md" color="green.600" mb={2}>{consulta.nomeDoPaciente}</Heading>
              <Text>Data de Nascimento: {new Date(consulta.dataNascimentoPaciente).toLocaleDateString()}</Text>
              <Text>Horário: {new Date(consulta.dataHoraAgendamento).toLocaleTimeString()}</Text>
              <Box whiteSpace="nowrap">
                <Text>Estado do Agendamento: {consulta.estadoDoAgendamento ? "Realizado" : "Não Realizado"}</Text>
                {consulta.estadoDoAgendamento && (
                  <Text>Conclusão do Atendimento: {consulta.conclusaoDoAgendamento ? "Vacina aplicada" : "Vacina não aplicada"}</Text>
                )}
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default DiaDetalhes;
