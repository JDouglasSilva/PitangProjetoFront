import { useState, useEffect } from 'react';
import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, HStack, VStack, useToast, Input } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { format, getHours, isToday } from 'date-fns';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomTimePicker from '../components/CustomTimePicker';

interface FormData {
  nome: string;
  dataNascimento: Date;
  diaAgendamento: Date;
  horaAgendamento: Date | null;
}

const Formulario = () => {
  const { control, register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>();
  const toast = useToast();
  const today = new Date();

  const diaAgendamento = watch('diaAgendamento');

  useEffect(() => {
    if (diaAgendamento) {
      setValue('horaAgendamento', null);
    }
  }, [diaAgendamento, setValue]);

  const filterTime = (time: Date) => {
    if (diaAgendamento && isToday(diaAgendamento)) {
      const now = new Date();
      return getHours(time) >= getHours(now);
    }
    return true;
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        dataNascimento: format(data.dataNascimento, 'yyyy-MM-dd'),
        diaAgendamento: format(data.diaAgendamento, 'yyyy-MM-dd'),
        horaAgendamento: data.horaAgendamento ? format(data.horaAgendamento, 'HH:mm') : null,
      };
      await axios.post('http://localhost:3000/agendamentos', formattedData);
      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar agendamento.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" p={4}>
      <Heading mb={4} color="green.800">Agendar Vacina</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.nome}>
            <FormLabel htmlFor="nome">Nome</FormLabel>
            <Input id="nome" placeholder="Nome" {...register('nome', { required: "Nome é obrigatório" })} />
            <FormErrorMessage>{errors.nome && errors.nome.message}</FormErrorMessage>
          </FormControl>

          <HStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.dataNascimento}>
              <FormLabel htmlFor="dataNascimento">Data de Nascimento</FormLabel>
              <Controller
                control={control}
                name="dataNascimento"
                rules={{ required: "Data de nascimento é obrigatória" }}
                render={({ field }) => (
                  <CustomDatePicker
                    selected={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    placeholder="Selecionar data"
                    maxDate={today}
                  />
                )}
              />
              <FormErrorMessage>{errors.dataNascimento && errors.dataNascimento.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.diaAgendamento}>
              <FormLabel htmlFor="diaAgendamento">Dia do Agendamento</FormLabel>
              <Controller
                control={control}
                name="diaAgendamento"
                rules={{ required: "Dia do agendamento é obrigatório" }}
                render={({ field }) => (
                  <CustomDatePicker
                    selected={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    placeholder="Selecionar data"
                    minDate={today}
                  />
                )}
              />
              <FormErrorMessage>{errors.diaAgendamento && errors.diaAgendamento.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.horaAgendamento} isDisabled={!diaAgendamento}>
              <FormLabel htmlFor="horaAgendamento">Hora do Agendamento</FormLabel>
              <Controller
                control={control}
                name="horaAgendamento"
                rules={{ required: "Hora do agendamento é obrigatória" }}
                render={({ field }) => (
                  <CustomTimePicker
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Selecionar hora"
                    filterTime={filterTime}
                  />
                )}
              />
              <FormErrorMessage>{errors.horaAgendamento && errors.horaAgendamento.message}</FormErrorMessage>
            </FormControl>
          </HStack>

          <Button type="submit" colorScheme="green" width="full">Agendar</Button>
        </VStack>
      </form>
    </Container>
  );
};

export default Formulario;
