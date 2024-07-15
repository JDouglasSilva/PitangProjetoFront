import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxW="container.lg" p={4}>
      <Flex direction="column" align="center" justify="center" minHeight="8vh">
        <Box 
          bg="white" 
          p={8} 
          borderWidth={1} 
          borderRadius="lg" 
          boxShadow="lg" 
          width="full" 
          maxW="4xl"
        >
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
            <Box flex="1" mb={{ base: 4, md: 0 }}>
              <Heading mb={4} color="green.800">Bem-vindo ao Portal de Agendamento de Vacinas</Heading>
              <Text mb={6} color="gray.700">
                Diante do cenário atual, existe uma demanda gigante de pessoas para tomar a vacina para o COVID-19. 
                Nossa cidade está precisando de um simples sistema para realizar os agendamentos. 
                O processo consiste na criação de um portal onde é possível agendar pacientes para tomar a vacina 
                e consultar os agendamentos.
                <br /><br />
                A vacinação é crucial para controlar a pandemia e proteger nossa comunidade. 
                Agende sua consulta agora e contribua para um futuro mais seguro.
              </Text>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Button 
                as={Link} 
                to="/formulario" 
                colorScheme="green" 
                mb={4}
                width="full"
              >
                Faça seu agendamento
              </Button>
              <Button 
                as={Link} 
                to="/agendamentos" 
                colorScheme="blue"
                width="full"
              >
                Consulte os agendamentos
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default Home;
