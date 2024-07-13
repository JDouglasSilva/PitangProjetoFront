import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup, Container, Flex, Heading, IconButton, Select, Spacer, Grid, GridItem, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import scheduleRepository from '../services/agendamentos/agendamentoRepository';
import YearView from '../components/agendamentos/YearView';
import MonthView from '../components/agendamentos/MonthView';
import DayView from '../components/agendamentos/DayView';

const Agendamentos = () => {
  const { year: paramYear, month: paramMonth, day: paramDay } = useParams();
  const [view, setView] = useState<'Ano' | 'Mês' | 'Dia'>('Ano');
  const [year, setYear] = useState(paramYear ? parseInt(paramYear, 10) : new Date().getFullYear());
  const [month, setMonth] = useState(paramMonth ? parseInt(paramMonth, 10) : new Date().getMonth() + 1);
  const [day, setDay] = useState(paramDay ? parseInt(paramDay, 10) : new Date().getDate());
  const [data, setData] = useState<any[]>([]);
  const [dailyCounts, setDailyCounts] = useState<{ day: number, count: number }[]>([]);
  const navigate = useNavigate();

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
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

    fetchData();
  }, [view, year, month, day]);

  const handlePrevious = () => {
    if (view === 'Ano') {
      setYear(prev => prev - 1);
    } else if (view === 'Mês') {
      if (month === 1) {
        setMonth(12);
        setYear(prev => prev - 1);
      } else {
        setMonth(prev => prev - 1);
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
      setYear(prev => prev + 1);
    } else if (view === 'Mês') {
      if (month === 12) {
        setMonth(1);
        setYear(prev => prev + 1);
      } else {
        setMonth(prev => prev + 1);
      }
    } else {
      const newDate = new Date(year, month - 1, day + 1);
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth() + 1);
      setDay(newDate.getDate());
    }
  };

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
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map((yearOption) => (
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
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map((yearOption) => (
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
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map((yearOption) => (
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
          <Button onClick={() => setView('Ano')} colorScheme={view === 'Ano' ? 'green' : 'gray'}>Ano</Button>
          <Button onClick={() => setView('Mês')} colorScheme={view === 'Mês' ? 'green' : 'gray'}>Mês</Button>
          <Button onClick={() => setView('Dia')} colorScheme={view === 'Dia' ? 'green' : 'gray'}>Dia</Button>
        </ButtonGroup>
      </Flex>
      {view === 'Ano' && <YearView data={data} monthNames={monthNames} setView={setView} setMonth={setMonth} year={year} />}
      {view === 'Mês' && <MonthView data={dailyCounts} month={month} year={year} dayNames={dayNames} setView={setView} setDay={setDay} />}
      {view === 'Dia' && <DayView data={data} />}
    </Container>
  );
};

export default Agendamentos;
