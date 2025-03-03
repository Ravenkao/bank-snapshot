
import { useState } from 'react';

interface LogoProps {
  url?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ url, name, size = 'md' }: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (!url || imageError) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500`}
        title={name}
      >
        {getInitials(name)}
      </div>
    );
  }
  
  return (
    <img 
      src={url} 
      alt={name} 
      className={`${sizeClasses[size]} rounded-full object-contain bg-white`}
      onError={() => setImageError(true)}
      title={name}
    />
  );
};

export default Logo;
