import React from 'react';
import { Box, Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const bgColor = useColorModeValue('green.800', 'green.900');
  const textColor = useColorModeValue('white', 'white');

  return (
    <Box bg={bgColor} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading as={Link} to="/" color={textColor} size="md">
          Portal Vacinação COVID-19
        </Heading>
      </Flex>
    </Box>
  );
};

export default Navbar;
