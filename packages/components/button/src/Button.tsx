import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Is this the principal call to action on the page?
   */
  variant?: 'primary' | 'secondary';
  /**
   * Button contents
   */
  children: React.ReactNode;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  const mode = variant === 'primary' ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-700';
  return (
    <button
      type="button"
      className={['text-white', 'font-bold', 'py-2', 'px-4', 'rounded', mode].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}; 