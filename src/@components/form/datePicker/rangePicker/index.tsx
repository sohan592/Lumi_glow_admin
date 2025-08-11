import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker/interface';
import { TimeRangePickerProps } from 'antd/lib';
import dayjs from 'dayjs';
import React from 'react';

interface CustomRangePickerProps extends RangePickerProps {
  customProp?: string;
  inputLabel?: string;
  errorMessage?: string;
  introduction?: string;
  rangePresets?: TimeRangePickerProps['presets'];
  withRangePresets?: boolean;
  required?: boolean;
}

const RangePickerComponent: React.FC<CustomRangePickerProps> = ({
  customProp,
  inputLabel,
  errorMessage,
  introduction,
  rangePresets,
  withRangePresets,
  required,
  status,
  ...rest
}) => {
  const { RangePicker } = DatePicker;
  const DefaultRangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Last 7 Days', value: [dayjs().subtract(7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().subtract(14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().subtract(30, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().subtract(90, 'd'), dayjs()] },
  ];

  return (
    <div>
      <p className="margin-bottom-s">
        {inputLabel}

        {required && <span className="error-200">*</span>}
      </p>
      <RangePicker
        presets={
          withRangePresets
            ? DefaultRangePresets
            : rangePresets
              ? rangePresets
              : []
        }
        status={errorMessage ? 'error' : status}
        {...rest}
      />
      <p className="error margin-top-xs">{errorMessage}</p>
      <p className="italic margin-top-xs">{introduction}</p>
    </div>
  );
};

export default RangePickerComponent;
