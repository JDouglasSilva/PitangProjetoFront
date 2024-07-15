import React, { forwardRef, useState, useEffect } from 'react';
import { Input, InputProps } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';

interface CustomDatePickerProps extends Omit<InputProps, 'onChange'> {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selected, onChange, dateFormat = 'dd/MM/yyyy', minDate, maxDate, ...props }) => {
  const [fullDays, setFullDays] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/agendamentos/${year}/${month}`)
      .then(response => {
        const days = response.data.filter((day: any) => day.count >= 20).map((day: any) => new Date(year, month - 1, day.day));
        setFullDays(days);
      })
      .catch(error => console.error('Failed to fetch full days', error));
  }, [currentMonth]);

  useEffect(() => {
    if (selected) {
      setCurrentMonth(selected);
    }
  }, [selected]);

  const CustomInput = forwardRef((inputProps: any, ref: any) => (
    <Input
      {...inputProps}
      ref={ref}
      readOnly
    />
  ));

  const isFullDay = (date: Date) => {
    return fullDays.find(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth());
  };

  const isPastDay = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const dayClassName = (date: Date) => {
    return isFullDay(date) && !isPastDay(date) ? 'full-day' : '';
  };

  const customDay = (date: Date) => {
    const isFull = isFullDay(date) && !isPastDay(date);
    return (
      <div
        style={{
          backgroundColor: isFull ? '#d3d3d3' : undefined,
          color: isFull ? '#666666' : undefined,
          pointerEvents: isFull ? 'none' : 'auto',
        }}
      >
        {date.getDate()}
      </div>
    );
  };

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={dateFormat}
      locale={ptBR}
      minDate={minDate}
      maxDate={maxDate}
      customInput={<CustomInput {...props} />}
      dayClassName={dayClassName}
      renderDayContents={(day, date) => customDay(date)}
      filterDate={date => !isFullDay(date) || isPastDay(date)}
    />
  );
};

export default CustomDatePicker;
