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
  yearRangeDirection?: 'past' | 'future';
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  dateFormat = 'dd/MM/yyyy',
  minDate,
  maxDate,
  yearRangeDirection = 'future', // default to future if not specified
  ...props
}) => {
  const [fullDays, setFullDays] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const currentYear = new Date().getFullYear();

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

  const yearOptions = yearRangeDirection === 'past'
    ? Array.from({ length: 130 }, (_, i) => currentYear - i) 
    : Array.from({ length: 4 }, (_, i) => currentYear + i);

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
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div style={{ margin: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2em",
              padding: "0 10px",
              color: "#007BFF"
            }}
          >
            {"<"}
          </button>
          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(parseInt(value))}
            style={{
              marginRight: "10px",
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: "pointer"
            }}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={date.getMonth()}
            onChange={({ target: { value } }) => changeMonth(parseInt(value))}
            style={{
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: "pointer"
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
              </option>
            ))}
          </select>
          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2em",
              padding: "0 10px",
              color: "#007BFF"
            }}
          >
            {">"}
          </button>
        </div>
      )}
    />
  );
};

export default CustomDatePicker;
