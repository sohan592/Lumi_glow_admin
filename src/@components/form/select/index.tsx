import { RiExpandUpDownLine } from '@remixicon/react';
import { Select, SelectProps } from 'antd';
import React from 'react';

interface CustomSelectProps extends SelectProps {
  customProp?: string;
  options: any[];
  placeholder?: string;
  suffixIcon?: React.ReactNode;
}

const SelectComponent: React.FC<CustomSelectProps> = ({
  customProp,
  options,
  placeholder,
  suffixIcon,
  ...rest
}) => {
  return (
    <Select
      options={options}
      style={{ width: 'auto' }}
      size="large"
      placeholder={placeholder ?? 'Select...'}
      suffixIcon={suffixIcon ?? <RiExpandUpDownLine />}
      {...rest}
    />
  );
};

export default SelectComponent;
