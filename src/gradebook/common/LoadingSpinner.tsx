import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
  return (
    <div className="p-4 overflow-auto flex justify-center items-center mt-16">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
    </div>
  );
};

export default LoadingSpinner; 
