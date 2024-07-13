// src/components/agendamentos/EditConsultaModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

interface EditConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  consulta: any;
  onUpdate: () => void; // Adicione esta linha
}

const EditConsultaModal: React.FC<EditConsultaModalProps> = ({ isOpen, onClose, consulta, onUpdate }) => { // Adicione onUpdate aos props
  const [estadoDoAgendamento, setEstadoDoAgendamento] = useState(consulta.estadoDoAgendamento ? 'true' : 'false');
  const [conclusaoDoAgendamento, setConclusaoDoAgendamento] = useState(consulta.conclusaoDoAgendamento ? 'true' : 'false');
  const toast = useToast();

  useEffect(() => {
    if (estadoDoAgendamento === 'false') {
      setConclusaoDoAgendamento('false');
    }
  }, [estadoDoAgendamento]);

  const handleSave = async () => {
    try {
      await axios.patch(`http://localhost:3000/agendamentos/${consulta.idAgendamento}`, {
        estadoDoAgendamento: estadoDoAgendamento === 'true',
        conclusaoDoAgendamento: conclusaoDoAgendamento === 'true'
      });
      toast({
        title: "Sucesso",
        description: "Consulta atualizada com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onUpdate(); // Chame o callback após a edição ser bem-sucedida
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar a consulta.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Consulta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl as="fieldset">
            <FormLabel as="legend">Estado do Agendamento</FormLabel>
            <RadioGroup
              onChange={setEstadoDoAgendamento}
              value={estadoDoAgendamento}
            >
              <Stack direction="row">
                <Radio value='true'>Realizado</Radio>
                <Radio value='false'>Não Realizado</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl as="fieldset" mt={4} isDisabled={estadoDoAgendamento === 'false'}>
            <FormLabel as="legend">Conclusão do Atendimento</FormLabel>
            <RadioGroup
              onChange={setConclusaoDoAgendamento}
              value={conclusaoDoAgendamento}
              isDisabled={estadoDoAgendamento === 'false'}
            >
              <Stack direction="row">
                <Radio value='true'>Vacina aplicada</Radio>
                <Radio value='false'>Vacina não aplicada</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Salvar
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditConsultaModal;
