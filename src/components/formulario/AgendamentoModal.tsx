import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text as ChakraText } from '@chakra-ui/react';
import { format } from 'date-fns';

interface AgendamentoInfo {
  nomeDoPaciente: string;
  diaAgendamento: Date;
  horaAgendamento: Date;
}

interface AgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  agendamentoInfo: AgendamentoInfo | null;
  handleNovoAgendamento: () => void;
  handleVerAgendamentos: () => void;
}

const AgendamentoModal: React.FC<AgendamentoModalProps> = ({ isOpen, onClose, agendamentoInfo, handleNovoAgendamento, handleVerAgendamentos }) => {
  if (!agendamentoInfo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>  {/* Updated this line */}
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agendamento marcado com sucesso</ModalHeader>
        <ModalBody>
          <ChakraText>Nome do paciente: {agendamentoInfo.nomeDoPaciente}</ChakraText>
          <ChakraText>Data do agendamento: {format(agendamentoInfo.diaAgendamento, 'dd/MM/yyyy')}</ChakraText>
          <ChakraText>Horario do agendamento: {format(agendamentoInfo.horaAgendamento, 'HH:mm')}</ChakraText>
          <ChakraText mt={4}>Marque outro agendamento para outra pessoa, ou veja seu agendamento no calendário de agendamentos.</ChakraText>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleNovoAgendamento}>
            Realizar outro agendamento
          </Button>
          <Button colorScheme="blue" onClick={handleVerAgendamentos}>
            Ver agendamentos
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AgendamentoModal;
