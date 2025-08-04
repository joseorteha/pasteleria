import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MairimCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  onClick?: () => void;
}

export const MairimCard: React.FC<MairimCardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick
}) => {
  const baseClasses = 'transition-all duration-300 rounded-modern bg-white';
  
  const variantClasses = {
    default: 'shadow-soft hover:shadow-medium border border-brand-accent',
    elevated: 'shadow-medium hover:shadow-lg border-0',
    outlined: 'shadow-none border-2 border-brand-primary/20 hover:border-brand-primary/40'
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        onClick && 'cursor-pointer hover-lift',
        className
      )}
    >
      {children}
    </Card>
  );
}; 