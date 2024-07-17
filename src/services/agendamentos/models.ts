// frontend/src/pages/services/agendamentos/models.tsx


export interface AgendamentoDTO {
    id: number;
    nomeDoPaciente: string;
    dataNascimentoPaciente: string;
    dataHoraAgendamento: string;
    estadoDoAgendamento: boolean;
    conclusaoDoAgendamento: boolean;
  }
  
  export interface DailyCount {
    day: number;
    count: number;
  }
  