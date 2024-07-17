// frontend/src/pages/Agendamentos.tsx


import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup, Container, Flex, Heading, IconButton, Select, Spacer } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import scheduleRepository from '../services/agendamentos/agendamentoRepository';
import YearView from '../components/agendamentos/YearView';
import MonthView from '../components/agendamentos/MonthView';
import DayView from '../components/agendamentos/DayView';

const Agendamentos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const initialView = state && state.year && state.month && state.day ? 'Dia' : 'Ano';
  const initialYear = state && state.year ? state.year : new Date().getFullYear();
  const initialMonth = state && state.month ? state.month : new Date().getMonth() + 1;
  const initialDay = state && state.day ? state.day : new Date().getDate();
  
  const [view, setView] = useState<'Ano' | 'Mês' | 'Dia'>(initialView);
  const [year, setYear] = useState<number>(initialYear);
  const [month, setMonth] = useState<number>(initialMonth);
  const [day, setDay] = useState<number>(initialDay);
  const [data, setData] = useState<any[]>([]);
  const [dailyCounts, setDailyCounts] = useState<{ day: number, count: number }[]>([]);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const fetchData = async () => {
    try {
      let response;
      if (view === 'Ano') {
        response = await scheduleRepository.getYearSchedules(year);
      } else if (view === 'Mês') {
        response = await scheduleRepository.getMonthSchedules(year, month);
        setDailyCounts(response);
      } else {
        response = await scheduleRepository.getDaySchedules(year, month, day);
      }
      setData(response);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view, year, month, day]);

  const handlePrevious = () => {
    if (view === 'Ano') {
      setYear((prev: number) => prev - 1);
    } else if (view === 'Mês') {
      if (month === 1) {
        setMonth(12);
        setYear((prev: number) => prev - 1);
      } else {
        setMonth((prev: number) => prev - 1);
      }
    } else {
      const newDate = new Date(year, month - 1, day - 1);
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth() + 1);
      setDay(newDate.getDate());
    }
  };

  const handleNext = () => {
    if (view === 'Ano') {
      setYear((prev: number) => prev + 1);
    } else if (view === 'Mês') {
      if (month === 12) {
        setMonth(1);
        setYear((prev: number) => prev + 1);
      } else {
        setMonth((prev: number) => prev + 1);
      }
    } else {
      const newDate = new Date(year, month - 1, day + 1);
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth() + 1);
      setDay(newDate.getDate());
    }
  };

  const handleChangeView = (newView: 'Ano' | 'Mês' | 'Dia') => {
    setView(newView);
    if (newView === 'Dia') {
      const currentDate = new Date();
      setYear(currentDate.getFullYear());
      setMonth(currentDate.getMonth() + 1);
      setDay(currentDate.getDate());
    }
  };

  //Os anos limites na barra de seleção começa em 2019 e termina 2 anos depois do ano atual
  //para deixar uma barra curta, e que se adapta com o tempo de uso do sistema
  const currentYear = new Date().getFullYear();
  const startYear = 2019;
  const endYear = currentYear + 2;

  return (
    <Container maxW="container.lg" p={4}>
      <Heading color="green.800" textAlign="center" mb={4}>Agendamentos</Heading>
      <Flex alignItems="center" mb={4}>
        <Flex flex="1" alignItems="center">
          <IconButton
            aria-label="Previous"
            icon={<ChevronLeftIcon />}
            onClick={handlePrevious}
            colorScheme="green"
            mr={2}
          />
          <Flex>
            {view === 'Ano' && (
              <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </Select>
            )}
            {view === 'Mês' && (
              <>
                <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {monthNames.map((monthName, index) => (
                    <option key={index} value={index + 1}>
                      {monthName}
                    </option>
                  ))}
                </Select>
                <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).map((yearOption) => (
                    <option key={yearOption} value={yearOption}>
                      {yearOption}
                    </option>
                  ))}
                </Select>
              </>
            )}
            {view === 'Dia' && (
              <>
                <Select value={day} onChange={(e) => setDay(Number(e.target.value))}>
                  {Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1).map((dayOption) => (
                    <option key={dayOption} value={dayOption}>
                      {dayOption}
                    </option>
                  ))}
                </Select>
                <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {monthNames.map((monthName, index) => (
                    <option key={index} value={index + 1}>
                      {monthName}
                    </option>
                  ))}
                </Select>
                <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).map((yearOption) => (
                    <option key={yearOption} value={yearOption}>
                      {yearOption}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </Flex>
          <IconButton
            aria-label="Next"
            icon={<ChevronRightIcon />}
            onClick={handleNext}
            colorScheme="green"
            ml={2}
          />
        </Flex>
        <Spacer />
        <ButtonGroup isAttached>
          <Button onClick={() => handleChangeView('Ano')} colorScheme={view === 'Ano' ? 'green' : 'gray'}>Ano</Button>
          <Button onClick={() => handleChangeView('Mês')} colorScheme={view === 'Mês' ? 'green' : 'gray'}>Mês</Button>
          <Button onClick={() => handleChangeView('Dia')} colorScheme={view === 'Dia' ? 'green' : 'gray'}>Dia</Button>
        </ButtonGroup>
      </Flex>
      {view === 'Ano' && <YearView data={data} monthNames={monthNames} setView={setView} setMonth={setMonth} year={year} />}
      {view === 'Mês' && <MonthView data={dailyCounts} month={month} year={year} dayNames={dayNames} setView={setView} setDay={setDay} />}
      {view === 'Dia' && <DayView data={data} onUpdate={fetchData} />} {/* Passe o callback para o componente DayView */}
    </Container>
  );
};

export default Agendamentos;
