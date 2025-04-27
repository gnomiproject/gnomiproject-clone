
import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'default' | 'sm' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: ButtonVariant;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  size?: ButtonSize;
  disabled?: boolean;
  style?: React.CSSProperties; // Added style property
}

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className,
  type = 'button',
  size = 'default',
  disabled = false,
  style // Add style to the destructuring
}: ButtonProps) => {
  const baseStyles = "px-6 py-3 rounded-full font-medium text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-blue-100 text-blue-500 hover:bg-blue-200",
    outline: "bg-white border border-blue-500 text-blue-500 hover:bg-blue-50"
  };
  
  const sizeStyles = {
    default: "",
    sm: "px-4 py-2 text-sm",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style} // Apply the style prop
      className={cn(
        baseStyles, 
        variantStyles[variant], 
        sizeStyles[size], 
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
