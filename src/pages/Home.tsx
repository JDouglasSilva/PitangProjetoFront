import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxW="container.lg" p={4}>
      <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
        <Box flex="1" mb={{ base: 4, md: 0 }}>
          <Heading mb={4} color="green.800">Bem-vindo ao Portal de Agendamento de Vacinas</Heading>
          <Text mb={6} color="gray.700">
            Diante do cenário atual, existe uma demanda gigante de pessoas para tomar a vacina para o COVID-19. 
            Nossa cidade está precisando de um simples sistema para realizar os agendamentos. 
            O processo consiste na criação de um portal onde será possível agendar pacientes para tomar a vacina 
            e consultar os agendamentos feitos por dia e horário.
            <br /><br />
            A vacinação é crucial para controlar a pandemia e proteger nossa comunidade. 
            Agende sua consulta agora e contribua para um futuro mais seguro.
          </Text>
          <Button as={Link} to="/formulario" colorScheme="green" mr={3}>
            Marque já seu agendamento
          </Button>
          <Button as={Link} to="/agendamentos" colorScheme="blue">
            Verifique os agendamentos feitos
          </Button>
        </Box>
      </Flex>
    </Container>
  );
};

export default Home;