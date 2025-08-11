import { Input } from 'antd';
import type { PasswordProps } from 'antd/es/input/Password';

interface CustomPasswordProps extends Omit<PasswordProps, 'type'> {
  inputTitle?: string;
  errorMessage?: string;
  introduction?: string;
  required?: boolean;
}

const PasswordComponent: React.FC<CustomPasswordProps> = ({
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
      <Input.Password {...rest} />
      <p className="error margin-top-xs">{errorMessage}</p>
      <p className="italic margin-top-xs">{introduction}</p>
    </div>
  );
};

export default PasswordComponent;
