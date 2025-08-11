import { Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input/TextArea';

interface CustomTextAreaProps extends Omit<TextAreaProps, 'type'> {
  inputTitle?: string;
  errorMessage?: string;
  introduction?: string;
  required?: boolean;
}

const TextAreaComponent: React.FC<CustomTextAreaProps> = ({
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
      <Input.TextArea {...rest} />
      <p className="error margin-top-xs">{errorMessage}</p>
      <p className="italic margin-top-xs">{introduction}</p>
    </div>
  );
};

export default TextAreaComponent;
