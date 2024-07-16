import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Button, VStack, FormControl, FormErrorMessage, FormLabel, HStack, Input } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import CustomDatePicker from '../CustomDatePicker';
import CustomTimePicker from '../CustomTimePicker';
import { format, getHours, isToday, getMinutes } from 'date-fns';

interface FormData {
  nomeDoPaciente: string;
  dataNascimentoPaciente: Date | null;
  diaAgendamento: Date | null;
  horaAgendamento: Date | null;
}

interface AgendamentoFormProps {
  onSubmit: (data: FormData) => void;
  saveFormData: (field: string, value: any) => void;
  setAgendamentoInfo: (data: FormData) => void;
  setIsModalOpen: (open: boolean) => void;
}

const AgendamentoForm = forwardRef<any, AgendamentoFormProps>(({ onSubmit, saveFormData, setAgendamentoInfo, setIsModalOpen }, ref) => {
  const { control, register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<FormData>();
  const today = new Date();
  const [horariosIndisponiveis, setHorariosIndisponiveis] = useState<Date[]>([]);
  const [isPageReload, setIsPageReload] = useState<boolean>(true);

  const diaAgendamento = watch('diaAgendamento');
  const horaAgendamento = watch('horaAgendamento');

  useImperativeHandle(ref, () => ({
    resetForm: () => reset()
  }));

  useEffect(() => {
    const storedValues = localStorage.getItem('formData');
    if (storedValues) {
      const parsedValues = JSON.parse(storedValues);
      setValue('nomeDoPaciente', parsedValues.nomeDoPaciente);
      setValue('dataNascimentoPaciente', parsedValues.dataNascimentoPaciente ? new Date(parsedValues.dataNascimentoPaciente) : null);
      setValue('diaAgendamento', parsedValues.diaAgendamento ? new Date(parsedValues.diaAgendamento) : null);
      setValue('horaAgendamento', parsedValues.horaAgendamento ? new Date(parsedValues.horaAgendamento) : null);
    }
    setIsPageReload(false);
  }, [setValue]);

  useEffect(() => {
    if (diaAgendamento) {
      if (!isPageReload) {
        setValue('horaAgendamento', null);
      }
      fetchHorariosIndisponiveis(diaAgendamento);
    }
  }, [diaAgendamento, setValue, isPageReload]);

  useEffect(() => {
    if (horaAgendamento && diaAgendamento) {
      const storedValues = JSON.parse(localStorage.getItem('formData') || '{}');
      storedValues.horaAgendamento = horaAgendamento;
      localStorage.setItem('formData', JSON.stringify(storedValues));
    }
  }, [horaAgendamento, diaAgendamento]);

  const fetchHorariosIndisponiveis = async (dia: Date) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/agendamentos/disponibilidade-hora/${dia.getFullYear()}/${dia.getMonth() + 1}/${dia.getDate()}`);
      const consultas: any[] = response.data;

      const horarios = consultas.reduce((acc: Date[], consulta: any) => {
        const dataHora = new Date(consulta.dataHoraAgendamento);
        if (acc.filter(h => h.getTime() === dataHora.getTime()).length < 2) {
          if (consultas.filter((c: any) => new Date(c.dataHoraAgendamento).getTime() === dataHora.getTime()).length === 2) {
            acc.push(dataHora);
          }
        }
        return acc;
      }, []);

      setHorariosIndisponiveis(horarios);

      // Preserve the hour if it was already selected before fetching unavailable hours and if it's still valid
      const storedValues = JSON.parse(localStorage.getItem('formData') || '{}');
      if (storedValues.horaAgendamento) {
        const selectedHour = new Date(storedValues.horaAgendamento);
        if (!horarios.some(h => h.getHours() === selectedHour.getHours() && h.getMinutes() === selectedHour.getMinutes())) {
          setValue('horaAgendamento', selectedHour);
        } else {
          setValue('horaAgendamento', null);
        }
      }
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

  const internalSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        nomeDoPaciente: data.nomeDoPaciente,
        dataNascimentoPaciente: format(data.dataNascimentoPaciente!, 'yyyy-MM-dd'),
        dataHoraAgendamento: format(new Date(data.diaAgendamento!.setHours(data.horaAgendamento?.getHours() || 0, data.horaAgendamento?.getMinutes() || 0)), 'yyyy-MM-dd HH:mm:ss'),
      };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/agendamentos`, formattedData);
      setAgendamentoInfo(data);
      setIsModalOpen(true);
      localStorage.removeItem('formData'); // Clear localStorage on successful submit
    } catch (error) {
      console.error("Falha ao criar agendamento.", error);
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        const storedValues = localStorage.getItem('formData');
        const formData = storedValues ? JSON.parse(storedValues) : {};
        formData[name] = value[name];
        localStorage.setItem('formData', JSON.stringify(formData));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(internalSubmit)}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.nomeDoPaciente}>
          <FormLabel htmlFor="nomeDoPaciente">Nome</FormLabel>
          <Input
            id="nomeDoPaciente"
            placeholder="Nome"
            {...register('nomeDoPaciente', {
              required: "Nome é obrigatório",
              validate: value => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const numberRegex = /\d/;
                const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
                if (emailRegex.test(value)) {
                  return "O nome não pode ser um email";
                }
                if (numberRegex.test(value)) {
                  return "O nome não pode conter números";
                }
                if (specialCharRegex.test(value)) {
                  return "O nome não pode conter caracteres especiais";
                }
                return true;
              }
            })}
          />
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
                  onChange={(date) => field.onChange(date)}
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
                    setIsPageReload(false);
                    field.onChange(date);
                  }}
                  placeholder="Selecionar data"
                  minDate={today}
                />
              )}
            />
            <FormErrorMessage>{errors.diaAgendamento && errors.diaAgendamento.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.horaAgendamento}>
            <FormLabel htmlFor="horaAgendamento">Hora do Agendamento</FormLabel>
            <Controller
              control={control}
              name="horaAgendamento"
              rules={{ required: "Hora do agendamento é obrigatória" }}
              render={({ field }) => (
                <CustomTimePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
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
  );
});

export default AgendamentoForm;
