import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  color = 'bg-primary-500' 
}) => {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">{label}</span>
          <span className="text-xs text-gray-500">{Math.round(safeProgress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${safeProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;