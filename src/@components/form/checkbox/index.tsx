import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface CheckBoxComponent {
  onChange: ((e: CheckboxChangeEvent) => void) | undefined;
  label?: string;
  style?: React.CSSProperties | undefined;
  isChecked?: boolean;
  isIndeterminate?: boolean;
}

export default function CheckBoxComponent({
  onChange,
  label,
  style,
  isChecked,
  isIndeterminate,
}: CheckBoxComponent) {
  return label ? (
    <Checkbox
      style={style}
      checked={isChecked}
      indeterminate={isIndeterminate}
      onChange={onChange}
    >
      {label}
    </Checkbox>
  ) : (
    <Checkbox style={style} onChange={onChange} />
  );
}
