import React, { useState } from 'react';
import { Box, Heading, Text, Flex, Button, useDisclosure } from '@chakra-ui/react';
import EditConsultaModal from './EditConsultaModal';

interface DayViewProps {
  data: any[];
}

const DayView: React.FC<DayViewProps> = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedConsulta, setSelectedConsulta] = useState(null);

  const groupedData = data.reduce((acc: { [key: string]: any[] }, consulta: any) => {
    const date = new Date(consulta.dataHoraAgendamento);
    const key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:00`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(consulta);
    return acc;
  }, {});

  const handleEditClick = (consulta: any) => {
    setSelectedConsulta(consulta);
    onOpen();
  };

  return (
    <Box>
      {Object.keys(groupedData).map((key: string) => (
        <Box key={key} p={4} borderWidth={1} borderRadius="lg" mb={4} boxShadow="md">
          <Heading size="md" color="green.600" mb={2}>{key}</Heading>
          <Flex>
            {groupedData[key].map((consulta: any, index: number) => (
              <Box key={index} p={4} borderWidth={1} borderRadius="lg" mb={4} boxShadow="md" flex="1" m={2} position="relative">
                <Button size="sm" position="absolute" top="5px" right="5px" onClick={() => handleEditClick(consulta)}>
                  Editar
                </Button>
                <Text>Nome do Paciente: {consulta.nomeDoPaciente}</Text>
                <Text>Data de Nascimento: {new Date(consulta.dataNascimentoPaciente).toLocaleDateString()}</Text>
                <Text>Estado do Agendamento: {consulta.estadoDoAgendamento ? "Realizado" : "Não Realizado"}</Text>
                {consulta.estadoDoAgendamento && (
                  <Text>Conclusão do Atendimento: {consulta.conclusaoDoAgendamento ? "Vacina aplicada" : "Vacina não aplicada"}</Text>
                )}
              </Box>
            ))}
          </Flex>
        </Box>
      ))}
      {selectedConsulta && (
        <EditConsultaModal
          isOpen={isOpen}
          onClose={onClose}
          consulta={selectedConsulta}
        />
      )}
    </Box>
  );
};

export default DayView;
