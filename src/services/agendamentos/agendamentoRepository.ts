// frontend/src/pages/services/agendamentos/agendamentoRepository.tsx

import axios from '../api';
import { AgendamentoDTO, DailyCount } from './models';

const scheduleRepository = {
  getYearSchedules: async (year: number): Promise<DailyCount[]> => {
    const response = await axios.get(`/agendamentos/${year}`);
    return response.data;
  },

  getMonthSchedules: async (year: number, month: number): Promise<DailyCount[]> => {
    const response = await axios.get(`/agendamentos/${year}/${month}`);
    return response.data;
  },

  getDaySchedules: async (year: number, month: number, day: number): Promise<AgendamentoDTO[]> => {
    const response = await axios.get(`/agendamentos/${year}/${month}/${day}`);
    return response.data;
  },

  createSchedule: async (schedule: Omit<AgendamentoDTO, 'id'>): Promise<AgendamentoDTO> => {
    const response = await axios.post('/agendamentos', schedule);
    return response.data;
  },
};

export default scheduleRepository;
