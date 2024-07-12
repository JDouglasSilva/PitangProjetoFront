import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

interface DayViewProps {
  data: any[];
}

const DayView: React.FC<DayViewProps> = ({ data }) => {
  const groupedData = data.reduce((acc: { [key: string]: any[] }, consulta: any) => {
    const date = new Date(consulta.dataHoraAgendamento);
    const key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:00`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(consulta);
    return acc;
  }, {});

  return (
    <Box>
      {Object.keys(groupedData).map((key: string) => (
        <Box key={key} p={4} borderWidth={1} borderRadius="lg" mb={4} boxShadow="md">
          <Heading size="md" color="green.600" mb={2}>{key}</Heading>
          {groupedData[key].map((consulta: any, index: number) => (
            <Box key={index} mb={4}>
              <Text>Nome do Paciente: {consulta.nomeDoPaciente}</Text>
              <Text>Data de Nascimento: {new Date(consulta.dataNascimentoPaciente).toLocaleDateString()}</Text>
              <Text>Estado do Agendamento: {consulta.estadoDoAgendamento ? "Realizado" : "Não Realizado"}</Text>
              {consulta.estadoDoAgendamento && (
                <Text>Conclusão do Atendimento: {consulta.conclusaoDoAgendamento ? "Vacina aplicada" : "Vacina não aplicada"}</Text>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default DayView;
