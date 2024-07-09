import { useState } from 'react';
import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, VStack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const schema = z.object({
  nomeDoPaciente: z.string().min(1, "Nome é obrigatório"),
  dataNascimentoPaciente: z.string().min(1, "Data de Nascimento é obrigatória"),
  dataHoraAgendamento: z.date({ required_error: "Data e Horário são obrigatórios" }),
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
      await axios.post('http://localhost:3000/agendamentos', {
        nomeDoPaciente: data.nomeDoPaciente,
        dataNascimentoPaciente: data.dataNascimentoPaciente,
        dataHoraAgendamento: data.dataHoraAgendamento.toISOString(),
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
    <Container maxW="container.md" p={4}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Heading mb={6} textAlign="center" color="green.800">Formulário de Agendamento</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.nomeDoPaciente}>
              <FormLabel htmlFor="nomeDoPaciente">Nome</FormLabel>
              <Input id="nomeDoPaciente" placeholder="Nome" {...register('nomeDoPaciente')} />
              <FormErrorMessage>{errors.nomeDoPaciente && errors.nomeDoPaciente.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.dataNascimentoPaciente}>
              <FormLabel htmlFor="dataNascimentoPaciente">Data de Nascimento</FormLabel>
              <Input id="dataNascimentoPaciente" type="date" {...register('dataNascimentoPaciente')} />
              <FormErrorMessage>{errors.dataNascimentoPaciente && errors.dataNascimentoPaciente.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.dataHoraAgendamento}>
              <FormLabel htmlFor="dataHoraAgendamento">Dia e Horário do Agendamento</FormLabel>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  setSelectedDate(date);
                  setValue('dataHoraAgendamento', date!);
                }}
                showTimeSelect
                dateFormat="Pp"
                customInput={<Input />}
              />
              <FormErrorMessage>{errors.dataHoraAgendamento && errors.dataHoraAgendamento.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="green" width="full">Agendar</Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default Formulario;
