// Minimalist Editorial Buttons
import React from 'react';
import { Link } from 'react-router-dom';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline-white' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  children,
  className = '',
  ...rest
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs sm:text-sm',
    lg: 'px-6 py-3.5 text-sm sm:text-base'
  }[size];

  const variantClasses = {
    primary:
      'bg-[#1749B5] text-white hover:bg-[#10182D] border border-transparent shadow-xs',
    secondary:
      'bg-white text-[#10182D] hover:bg-[#F5F6F8] border border-[#E2E6EE] shadow-xs',
    dark:
      'bg-[#10182D] text-white hover:bg-[#1749B5] border border-white/10 shadow-xs',
    'outline-white':
      'bg-transparent text-white border border-white/30 hover:bg-white hover:text-[#10182D]',
    ghost:
      'bg-transparent text-[#1749B5] hover:text-[#10182D] p-0 font-semibold'
  }[variant];

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer select-none group ${sizeClasses} ${variantClasses} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button className={baseClasses} {...rest}>
      {content}
    </button>
  );
};

export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const DarkButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="dark" {...props} />
);

export const OutlineWhiteButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="outline-white" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);
