import { Button, ButtonProps } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type CustomButtonType =
  | 'primary'
  | 'dashed'
  | 'link'
  | 'text'
  | 'default'
  | 'icon';

interface CustomButtonProps extends Omit<ButtonProps, 'type'> {
  customProp?: string;
  backgroundColor?: string;
  fontSize?: string;
  color?: 'default' | 'danger' | 'primary';
  buttonColor?: string;
  fullWidth?: boolean;
  fontWeight?: string;
  borderRadius?: string;
  padding?: string;
  border?: string;
  iconTextSpacing?: {
    marginRight?: string;
    marginLeft?: string;
  };
  isActive?: boolean;
  type?: CustomButtonType;
  justifyContent?: 'flex-start' | 'flex-end' | 'center';
}

const ButtonComponent: React.FC<CustomButtonProps> = ({
  customProp,
  backgroundColor,
  fontSize,
  color,
  buttonColor,
  fullWidth,
  fontWeight,
  borderRadius,
  padding,
  border,
  iconTextSpacing,
  isActive,
  type,
  justifyContent = 'center',
  onClick,
  ...rest
}) => {
  const { icon, href, children, ...buttonProps } = rest;
  const navigate = useNavigate();

  const handleClick = (e: any) => {
    if (onClick) {
      onClick(e);
    } else if (href) {
      navigate(href);
    }
  };

  const generateBgColor = (type: string) => {
    switch (type) {
      case 'primary':
        return 'var(--primary-600)';
      case 'default':
        return 'var(--neutrals-200)';
      case 'text':
        return 'var(--neutrals-100)';
      case 'link':
        return 'var(--neutrals-200)';
      case 'ghost':
        return 'var(--neutrals-200)';
      default:
        return 'var(--neutrals-200)';
    }
  };

  return (
    <Button
      style={{
        backgroundColor: backgroundColor
          ? backgroundColor
          : isActive
            ? generateBgColor(type ?? 'default')
            : '',
        fontSize,
        color: buttonColor,
        fontWeight,
        borderRadius,
        padding: padding ? padding : type === 'icon' ? '6px' : undefined,
        border,
        justifyContent: justifyContent,
        ...rest.style,
      }}
      block={fullWidth}
      type={type && type !== 'icon' ? type : 'default'}
      onClick={handleClick}
      icon={
        icon
          ? React.cloneElement(icon as React.ReactElement, {
              style: iconTextSpacing,
            })
          : null
      }
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
