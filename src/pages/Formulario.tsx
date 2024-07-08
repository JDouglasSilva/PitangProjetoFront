import { useState } from 'react';
import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, VStack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  dataNascimento: z.string().min(1, "Data de Nascimento é obrigatória"),
  dataHora: z.date({ required_error: "Data e Horário são obrigatórios" }),
});

type FormData = z.infer<typeof schema>;

const Formulario = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  const toast = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('http://localhost:3000/agendar', {
        nome: data.nome,
        dataNascimento: data.dataNascimento,
        dataHora: data.dataHora.toISOString(),
      });
      toast({
        title: "Sucesso",
        description: "Cadastro realizado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao realizar o cadastro.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  setSelectedDate(date);
                  setValue('dataHora', date!);
                }}
                showTimeSelect
                dateFormat="Pp"
                customInput={<Input />}
              />
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
