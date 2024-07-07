// Path: ProjetoPitang\frontend\src\pages\Formulario.tsx

import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  dataNascimento: z.string().min(1, "Data de Nascimento é obrigatória"),
  dataHora: z.string().min(1, "Data e Horário são obrigatórios"),
});

type FormData = z.infer<typeof schema>;

const Formulario = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: FormData) => {
    console.log("Simulação de cadastro feito com os seguintes dados:", data);
  };

  return (
    <Container maxW="container.lg" p={4}>
      <Box p={4} borderWidth={1} borderRadius="lg">
        <Heading mb={6} textAlign="center" color="green.800">Formulário de Agendamento</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.nome}>
              <FormLabel htmlFor="nome">Nome</FormLabel>
              <Input id="nome" placeholder="Nome" {...register('nome')} />
              <FormErrorMessage>{errors.nome && errors.nome.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.dataNascimento}>
              <FormLabel htmlFor="dataNascimento">Data de Nascimento</FormLabel>
              <Input id="dataNascimento" type="date" {...register('dataNascimento')} />
              <FormErrorMessage>{errors.dataNascimento && errors.dataNascimento.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.dataHora}>
              <FormLabel htmlFor="dataHora">Dia e Horário do Agendamento</FormLabel>
              <Input id="dataHora" type="datetime-local" {...register('dataHora')} />
              <FormErrorMessage>{errors.dataHora && errors.dataHora.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="green" width="full">Agendar</Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};
export default Formulario;