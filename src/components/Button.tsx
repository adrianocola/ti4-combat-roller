import React from 'react';

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'title'
> {
  title?: string | number;
  transparent?: boolean;
  titleClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  disabled,
  className = '',
  title,
  transparent,
  titleClassName = '',
  children,
  ...props
}) => {
  const base = transparent
    ? 'rounded-md px-2.5 py-1 transition-opacity active:opacity-50 disabled:opacity-25'
    : 'rounded-md px-2.5 py-1 bg-app-button border border-app-white/30 transition-opacity active:opacity-50 disabled:opacity-25';

  return (
    <button
      {...props}
      disabled={disabled}
      className={`${base} ${className}`.trim()}>
      {title !== undefined ? (
        <span
          className={`text-app-white font-bold text-center block ${titleClassName}`.trim()}>
          {title}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default React.memo(Button);
