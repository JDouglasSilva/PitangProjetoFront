import React, { forwardRef } from 'react';
import { Input, InputProps } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';

interface CustomDatePickerProps extends Omit<InputProps, 'onChange'> {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selected, onChange, dateFormat = 'dd/MM/yyyy', minDate, maxDate, ...props }) => {
  const CustomInput = forwardRef((inputProps: any, ref: any) => (
    <Input
      {...inputProps}
      ref={ref}
      readOnly
    />
  ));

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={dateFormat}
      locale={ptBR}
      minDate={minDate}
      maxDate={maxDate}
      customInput={<CustomInput {...props} />}
    />
  );
};

export default CustomDatePicker;
