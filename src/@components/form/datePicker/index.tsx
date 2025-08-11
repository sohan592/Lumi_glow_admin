import React from 'react';
import { DatePicker, DatePickerProps } from 'antd';

interface CustomDatePickerProps extends DatePickerProps {
  customProp?: string;
  inputTitle?: string;
  errorMessage?: string;
  introduction?: string;
  required?: boolean;
}

const DatePickerComponent: React.FC<CustomDatePickerProps> = ({
  customProp,
  inputTitle,
  errorMessage,
  introduction,
  required,
  ...rest
}) => {
  return (
    <div>
      <p className="margin-bottom-s">
        {inputTitle}
        {required && <span className="error-200">*</span>}
      </p>
      <DatePicker {...rest} />
      <p className="error margin-top-xs">{errorMessage}</p>
      <p className="italic margin-top-xs">{introduction}</p>
    </div>
  );
};

export default DatePickerComponent;
