// frontend/src/pages/Formulario.tsx

import { useRef, useState } from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AgendamentoForm from '../components/formulario/AgendamentoForm';
import AgendamentoModal from '../components/formulario/AgendamentoModal';

interface FormData {
  nomeDoPaciente: string;
  dataNascimentoPaciente: Date | null;
  diaAgendamento: Date | null;
  horaAgendamento: Date | null;
}

const Formulario = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agendamentoInfo, setAgendamentoInfo] = useState<FormData | null>(null);
  const navigate = useNavigate();
  const formRef = useRef<any>(null);

  const handleNovoAgendamento = () => {
    setAgendamentoInfo(null);
    setIsModalOpen(false);
    formRef.current.resetForm();
  };

  const handleVerAgendamentos = () => {
    if (agendamentoInfo) {
      const { diaAgendamento } = agendamentoInfo;
      navigate('/agendamentos', { state: { year: diaAgendamento!.getFullYear(), month: diaAgendamento!.getMonth() + 1, day: diaAgendamento!.getDate() } });
    } else {
      navigate('/agendamentos');
    }
  };

  const saveFormData = (field: string, value: any) => {
    const storedValues = localStorage.getItem('formData');
    const formData = storedValues ? JSON.parse(storedValues) : {};
    formData[field] = value;
    localStorage.setItem('formData', JSON.stringify(formData));
  };

  const handleSubmit = (data: FormData) => {
    setAgendamentoInfo(data);
    setIsModalOpen(true);
  };

  return (
    <Container maxW="container.sm" p={4}>
      <Heading mb={4} color="green.800">Agendar Vacina</Heading>
      <AgendamentoForm ref={formRef} onSubmit={handleSubmit} saveFormData={saveFormData} setAgendamentoInfo={setAgendamentoInfo} setIsModalOpen={setIsModalOpen} />
      {agendamentoInfo && (
        <AgendamentoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          agendamentoInfo={{
            nomeDoPaciente: agendamentoInfo.nomeDoPaciente,
            diaAgendamento: agendamentoInfo.diaAgendamento!,
            horaAgendamento: agendamentoInfo.horaAgendamento!
          }}
          handleNovoAgendamento={handleNovoAgendamento}
          handleVerAgendamentos={handleVerAgendamentos}
        />
      )}
    </Container>
  );
};

export default Formulario;
