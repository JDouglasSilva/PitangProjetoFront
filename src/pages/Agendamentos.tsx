import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup, Container, Flex, Heading, Text, Grid, GridItem, IconButton, Progress, Select, Spacer } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import axios from 'axios';

interface Consulta {
  nomeDoPaciente: string;
  dataNascimentoPaciente: string;
  dataHoraAgendamento: string;
  estadoDoAgendamento: boolean;
  conclusaoDoAgendamento: boolean;
}

const Agendamentos = () => {
  const [view, setView] = useState<'Ano' | 'Mês' | 'Dia'>('Ano');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [data, setData] = useState<any[]>([]);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (view === 'Ano') {
          response = await axios.get(`http://localhost:3000/agendamentos/${year}`);
        } else if (view === 'Mês') {
          response = await axios.get(`http://localhost:3000/agendamentos/${year}/${month}`);
        } else {
          response = await axios.get(`http://localhost:3000/agendamentos/${year}/${month}/${day}`);
        }
        setData(response.data);
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

  const getColorForProgress = (value: number) => {
    if (value < 50) return 'green';
    if (value < 75) return 'yellow';
    return 'red';
  };

  const renderCalendar = () => {
    const startDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<GridItem key={`empty-${i}`} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayData = data.find(d => d.day === i) || { count: 0 };
      const progressValue = (dayData.count / 20) * 100;
      days.push(
        <GridItem
          key={i}
          p={2}
          borderWidth={1}
          borderRadius="lg"
          textAlign="center"
          boxShadow="md"
          cursor="pointer"
          onClick={() => { setView('Dia'); setDay(i); }}
        >
          <Box>
            <Heading size="sm">Dia {i}</Heading>
            <Text mt={2}>Agendamentos: {dayData.count}</Text>
            <Progress 
              value={progressValue} 
              size="sm" 
              colorScheme={getColorForProgress(progressValue)}
              mt={2} 
            />
          </Box>
        </GridItem>
      );
    }

    return days;
  };

  const renderYearView = () => {
    return (
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
        {data.map((item, index) => {
          const daysInMonth = new Date(year, item.month, 0).getDate();
          const maxConsultations = daysInMonth * 20;
          const progressValue = (item.count / maxConsultations) * 100;
          return (
            <GridItem
              key={index}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              textAlign="center"
              boxShadow="md"
              cursor="pointer"
              onClick={() => { setView('Mês'); setMonth(item.month); }}
            >
              <Box>
                <Heading size="md">{monthNames[item.month - 1]}</Heading>
                <Text mt={2}>Agendamentos: {item.count}</Text>
                <Progress
                  value={progressValue}
                  size="sm"
                  colorScheme={getColorForProgress(progressValue)}
                  mt={2}
                />
              </Box>
            </GridItem>
          );
        })}
      </Grid>
    );
  };

  const renderDayView = () => {
    const groupedData = data.reduce((acc: { [key: string]: Consulta[] }, consulta: Consulta) => {
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
            {groupedData[key].map((consulta: Consulta, index: number) => (
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
      {view === 'Ano' && renderYearView()}
      {view === 'Mês' && (
        <Box>
          <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={4}>
            {dayNames.map((dayName, index) => (
              <GridItem key={index} textAlign="center" fontWeight="bold">{dayName}</GridItem>
            ))}
          </Grid>
          <Grid templateColumns="repeat(7, 1fr)" gap={2}>
            {renderCalendar()}
          </Grid>
        </Box>
      )}
      {view === 'Dia' && renderDayView()}
    </Container>
  );
};

export default Agendamentos;
