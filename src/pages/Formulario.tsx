import { useState, useEffect } from 'react';
import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, HStack, VStack, useToast, Input } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { format, getHours, isToday, getMinutes } from 'date-fns';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomTimePicker from '../components/CustomTimePicker';

interface FormData {
  nomeDoPaciente: string;
  dataNascimentoPaciente: Date;
  diaAgendamento: Date;
  horaAgendamento: Date | null;
}

interface Consulta {
  dataHoraAgendamento: string;
}

const Formulario = () => {
  const { control, register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>();
  const toast = useToast();
  const today = new Date();
  const [horariosIndisponiveis, setHorariosIndisponiveis] = useState<Date[]>([]);

  const diaAgendamento = watch('diaAgendamento');

  useEffect(() => {
    if (diaAgendamento) {
      setValue('horaAgendamento', null);
      fetchHorariosIndisponiveis(diaAgendamento);
    }
  }, [diaAgendamento, setValue]);

  const fetchHorariosIndisponiveis = async (dia: Date) => {
    try {
      const response = await axios.get(`http://localhost:3000/agendamentos/disponibilidade-hora/${dia.getFullYear()}/${dia.getMonth() + 1}/${dia.getDate()}`);
      const consultas: Consulta[] = response.data;

      const horarios = consultas.reduce((acc: Date[], consulta: Consulta) => {
        const dataHora = new Date(consulta.dataHoraAgendamento);
        if (acc.filter(h => h.getTime() === dataHora.getTime()).length < 2) {
          if (consultas.filter((c: Consulta) => new Date(c.dataHoraAgendamento).getTime() === dataHora.getTime()).length === 2) {
            acc.push(dataHora);
          }
        }
        return acc;
      }, []);

      setHorariosIndisponiveis(horarios);
    } catch (error) {
      console.error('Erro ao buscar horários indisponíveis:', error);
    }
  };

  const filterTime = (time: Date) => {
    if (diaAgendamento && isToday(diaAgendamento)) {
      const now = new Date();
      return getHours(time) >= getHours(now) && getMinutes(time) >= getMinutes(now);
    }

    return !horariosIndisponiveis.some(horario => 
      horario.getHours() === time.getHours() && horario.getMinutes() === time.getMinutes()
    );
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        nomeDoPaciente: data.nomeDoPaciente,
        dataNascimentoPaciente: format(data.dataNascimentoPaciente, 'yyyy-MM-dd'),
        dataHoraAgendamento: format(new Date(data.diaAgendamento.setHours(data.horaAgendamento?.getHours() || 0, data.horaAgendamento?.getMinutes() || 0)), 'yyyy-MM-dd HH:mm:ss'),
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
          <FormControl isInvalid={!!errors.nomeDoPaciente}>
            <FormLabel htmlFor="nomeDoPaciente">Nome</FormLabel>
            <Input id="nomeDoPaciente" placeholder="Nome" {...register('nomeDoPaciente', { required: "Nome é obrigatório" })} />
            <FormErrorMessage>{errors.nomeDoPaciente && errors.nomeDoPaciente.message}</FormErrorMessage>
          </FormControl>

          <HStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.dataNascimentoPaciente}>
              <FormLabel htmlFor="dataNascimentoPaciente">Data de Nascimento</FormLabel>
              <Controller
                control={control}
                name="dataNascimentoPaciente"
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
              <FormErrorMessage>{errors.dataNascimentoPaciente && errors.dataNascimentoPaciente.message}</FormErrorMessage>
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
