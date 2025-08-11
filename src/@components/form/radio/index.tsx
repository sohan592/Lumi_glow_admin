import React, { Fragment } from 'react';
import { Radio, RadioGroupProps, Space } from 'antd';

interface CustomRadioProps extends RadioGroupProps {
  spaceDirection?: 'vertical' | 'horizontal';
  options: {
    label: string;
    value: string | number;
    order?: string;
  }[];
  setDataSortOrder?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  children,
  spaceDirection = 'vertical',
  options,
  ...rest
}) => {
  const { Group } = Radio;
  return (
    <Group {...rest}>
      {options && (
        <Fragment>
          <Space direction={spaceDirection}>
            {options.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                onChange={(e) => {
                  rest.onChange?.(e);
                  rest.setDataSortOrder?.(option.order);
                }}
              >
                {option.label}
              </Radio>
            ))}
          </Space>
        </Fragment>
      )}
      {options.length === 0 && children && (
        <Space direction={spaceDirection}>{children}</Space>
      )}
    </Group>
  );
};

export default CustomRadio;
