import React from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';

interface CustomInputProps extends InputProps {
  customProp?: string;
  inputTitle?: string;
  errorMessage?: string;
  introduction?: string;
  required?: boolean;
}

const InputComponent: React.FC<CustomInputProps> = ({
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
      <Input {...rest} />
      <p className="error margin-top-xs">{errorMessage}</p>
      <p className="italic margin-top-xs">{introduction}</p>
    </div>
  );
};

export default InputComponent;
