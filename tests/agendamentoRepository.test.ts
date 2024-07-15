import axios from '../src/services/api';
import scheduleRepository from '../src/services/agendamentos/agendamentoRepository';
import { AgendamentoDTO, DailyCount } from '../src/services/agendamentos/models';

jest.mock('../src/services/api');

describe('agendamentoRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve retornar a contagem de agendamentos por ano', async () => {
    const mockData: DailyCount[] = [
      { day: 1, count: 10 },
      { day: 2, count: 5 },
    ];

    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await scheduleRepository.getYearSchedules(2024);

    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith('/agendamentos/2024');
  });

  test('deve retornar a contagem de agendamentos por mês', async () => {
    const mockData: DailyCount[] = [
      { day: 1, count: 10 },
      { day: 2, count: 5 },
    ];

    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await scheduleRepository.getMonthSchedules(2024, 7);

    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith('/agendamentos/2024/7');
  });

  test('deve retornar agendamentos por dia', async () => {
    const mockData: AgendamentoDTO[] = [
      {
        id: 1,
        nomeDoPaciente: 'John Doe',
        dataNascimentoPaciente: '1990-01-01',
        dataHoraAgendamento: '2024-07-15T10:00:00',
        estadoDoAgendamento: false,
        conclusaoDoAgendamento: false,
      },
      {
        id: 2,
        nomeDoPaciente: 'Jane Doe',
        dataNascimentoPaciente: '1985-05-20',
        dataHoraAgendamento: '2024-07-15T11:00:00',
        estadoDoAgendamento: true,
        conclusaoDoAgendamento: true,
      },
    ];

    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await scheduleRepository.getDaySchedules(2024, 7, 15);

    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith('/agendamentos/2024/7/15');
  });

  test('deve criar um novo agendamento', async () => {
    const newAgendamento: Omit<AgendamentoDTO, 'id'> = {
      nomeDoPaciente: 'John Doe',
      dataNascimentoPaciente: '1990-01-01',
      dataHoraAgendamento: '2024-07-15T10:00:00',
      estadoDoAgendamento: false,
      conclusaoDoAgendamento: false,
    };

    const createdAgendamento: AgendamentoDTO = {
      id: 1,
      ...newAgendamento,
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: createdAgendamento });

    const result = await scheduleRepository.createSchedule(newAgendamento);

    expect(result).toEqual(createdAgendamento);
    expect(axios.post).toHaveBeenCalledWith('/agendamentos', newAgendamento);
  });
});
