import React from 'react';
import { InputNumber, InputNumberProps } from 'antd';

interface CustomInputNumberProps extends InputNumberProps {
  inputLabel?: string;
  errorMessage?: string;
  introduction?: string;
  withRangePresets?: boolean;
  fullWidth?: boolean;
  padding?: string;
  border?: string;
  required?: boolean;
}

const InputNumberComponent: React.FC<CustomInputNumberProps> = ({
  inputLabel,
  errorMessage,
  introduction,
  fullWidth,
  padding,
  border,
  required,
  ...rest
}) => {
  return (
    <div>
      <p className="margin-bottom-s">
        {inputLabel}

        {required && <span className="error-200">*</span>}
      </p>
      <InputNumber
        type="number"
        style={{ width: fullWidth ? '100%' : 'auto', padding, border }}
        {...rest}
      />
      <p className="error margin-top-xs">{errorMessage}</p>
      <p className="italic margin-top-xs">{introduction}</p>
    </div>
  );
};

export default InputNumberComponent;
