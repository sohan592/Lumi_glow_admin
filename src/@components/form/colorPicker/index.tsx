import { Flex, Input, Space } from 'antd';
import hexRgb from 'hex-rgb';
import { Fragment, useState } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';
import rgbHex from 'rgb-hex';
interface ColorPickerProps {
  hexValue?: string;
  onChange?: ({}) => void;
  inputLabel?: string;
}

// Not completed yet

const ColorPickerComponent = ({
  hexValue,
  onChange,
  inputLabel,
}: ColorPickerProps) => {
  const [color, setColor] = useState(hexValue ?? '#fff');
  const [rgbCode, setRgbCode] = useState<{
    r?: number;
    g?: number;
    b?: number;
  } | null>({ r: 255, g: 255, b: 255 });

  const handleColorChange = (e: string) => {
    setColor(e);
    const rgb = hexRgb(e);
    setRgbCode({
      r: rgb.red,
      g: rgb.green,
      b: rgb.blue,
    });
    if (onChange) {
      onChange({
        hexValue: e,
        rgbValue: {
          r: rgb.red,
          g: rgb.green,
          b: rgb.blue,
        },
      });
    }
  };

  return (
    <Fragment>
      {inputLabel && <p className="margin-bottom-xs">{inputLabel}</p>}
      <div className="color_picker_container">
        <HexAlphaColorPicker color={color} onChange={handleColorChange} />
        <Flex justify="space-between" gap={3}>
          <div>
            <span className="font_size_sm">HEX</span>
            <Input
              style={{
                height: '27px',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
                padding: '0 3px',
                fontSize: '10px',
              }}
              placeholder="#..."
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                const rgb = hexRgb(e.target.value);
                setRgbCode({
                  r: rgb.red,
                  g: rgb.green,
                  b: rgb.blue,
                });
              }}
            />
          </div>
          <div>
            <Space.Compact>
              <div>
                <span className="font_size_sm">R</span>
                <Input
                  className="font_size_sm"
                  defaultValue="01"
                  value={rgbCode?.r}
                  onChange={(e) => {
                    setRgbCode({ ...rgbCode, r: parseInt(e.target.value) });
                    const hexCode = rgbHex(
                      parseInt(e.target.value) ?? 255,
                      rgbCode?.g ?? 255,
                      rgbCode?.b ?? 255,
                    );
                    setColor(`#${hexCode}`);
                  }}
                  style={{
                    padding: '4px 3px',
                  }}
                />
              </div>
              <div>
                <span className="font_size_sm">G</span>
                <Input
                  className="font_size_sm"
                  defaultValue="01"
                  value={rgbCode?.g}
                  onChange={(e) => {
                    setRgbCode({ ...rgbCode, g: parseInt(e.target.value) });
                    const hecCode = rgbHex(
                      rgbCode?.r ?? 255,
                      rgbCode?.g ?? 255,
                      rgbCode?.b ?? 255,
                    );
                    setColor(`#${hecCode}`);
                  }}
                  style={{
                    padding: '4px 3px',
                  }}
                />
              </div>
              <div>
                <span className="font_size_sm">B</span>
                <Input
                  className="font_size_sm"
                  defaultValue="01"
                  value={rgbCode?.b}
                  onChange={(e) => {
                    setRgbCode({ ...rgbCode, b: parseInt(e.target.value) });
                    const hecCode = rgbHex(
                      rgbCode?.r ?? 255,
                      rgbCode?.g ?? 255,
                      rgbCode?.b ?? 255,
                    );
                    setColor(`#${hecCode}`);
                  }}
                  style={{
                    padding: '4px 3px',
                  }}
                />
              </div>
            </Space.Compact>
          </div>
        </Flex>
      </div>
    </Fragment>
  );
};

export default ColorPickerComponent;
