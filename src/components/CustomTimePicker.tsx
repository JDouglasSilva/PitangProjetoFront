import React, { forwardRef } from 'react';
import { Input, InputProps } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';

interface CustomTimePickerProps extends Omit<InputProps, 'onChange'> {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  filterTime?: (time: Date) => boolean;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ selected, onChange, filterTime, ...props }) => {
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
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={60}
      timeCaption="Time"
      dateFormat="HH:mm"
      locale={ptBR}
      customInput={<CustomInput {...props} />}
      filterTime={filterTime}
    />
  );
};

export default CustomTimePicker;
