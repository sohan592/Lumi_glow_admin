import { Input } from 'antd';
import type { OTPProps } from 'antd/es/input/OTP';

interface CustomOTPProps extends OTPProps {
  inputTitle?: string;
  errorMessage?: string;
  introduction?: string;
  required?: boolean;
}

const OTPComponent: React.FC<CustomOTPProps> = ({
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
      <Input.OTP {...rest} />
      <p className="error margin-top-xs">{errorMessage}</p>
      <p className="italic margin-top-xs">{introduction}</p>
    </div>
  );
};

export default OTPComponent;
