import { Dropdown } from 'antd';
import { PropsWithChildren } from 'react';

interface DropDownComponentProps {
  items: any;
  disabled?: boolean;
  dropdownCardClassName?: string;
}

export default function DropDownComponent({
  items,
  disabled,
  dropdownCardClassName,
  children,
}: PropsWithChildren<DropDownComponentProps>) {
  return (
    <Dropdown
      rootClassName={dropdownCardClassName}
      disabled={disabled}
      menu={{ items }}
      trigger={['click']}
    >
      {children}
    </Dropdown>
  );
}
