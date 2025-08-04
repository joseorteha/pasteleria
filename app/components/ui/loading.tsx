import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Círculo exterior */}
        <div className="absolute inset-0 rounded-full border-2 border-brand-accent"></div>
        
        {/* Círculo animado */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-primary animate-spin"></div>
        
        {/* Punto central */}
        <div className="absolute inset-2 rounded-full bg-brand-primary/20"></div>
      </div>
    </div>
  );
};

export const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-cream">
      <div className="text-center space-y-4">
        <Loading size="lg" />
        <p className="text-brand-warm font-medium">Cargando...</p>
      </div>
    </div>
  );
};

export const LoadingCard: React.FC = () => {
  return (
    <div className="bg-white rounded-modern shadow-soft p-6 animate-pulse">
      <div className="space-y-4">
        {/* Imagen placeholder */}
        <div className="w-full h-48 bg-brand-accent rounded-modern"></div>
        
        {/* Contenido placeholder */}
        <div className="space-y-2">
          <div className="h-4 bg-brand-accent rounded w-3/4"></div>
          <div className="h-3 bg-brand-accent rounded w-1/2"></div>
          <div className="h-3 bg-brand-accent rounded w-2/3"></div>
        </div>
        
        {/* Botones placeholder */}
        <div className="flex space-x-2">
          <div className="h-8 bg-brand-accent rounded w-20"></div>
          <div className="h-8 bg-brand-accent rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}; 