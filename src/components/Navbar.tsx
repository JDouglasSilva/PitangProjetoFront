// frontend/src/components/Navbar.tsx

import React from 'react';
import { Box, Flex, Heading, useColorModeValue, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const bgColor = useColorModeValue('green.800', 'green.900');
  const textColor = useColorModeValue('white', 'white');
  const buttonBgColor = useColorModeValue('green.600', 'green.700');
  const buttonHoverBgColor = useColorModeValue('green.500', 'green.600');

  return (
    <Box bg={bgColor} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading as={Link} to="/" color={textColor} size="md">
          Portal Vacinação COVID-19
        </Heading>
        <Flex alignItems="center">
          <Button 
            as={Link} 
            to="/formulario" 
            bg={buttonBgColor} 
            color={textColor} 
            _hover={{ bg: buttonHoverBgColor }} 
            mr={4}
          >
            Faça seu agendamento
          </Button>
          <Button 
            as={Link} 
            to="/agendamentos" 
            bg={buttonBgColor} 
            color={textColor} 
            _hover={{ bg: buttonHoverBgColor }}
          >
            Consulte os agendamentos
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
