import React, { ReactNode } from 'react';

interface AlgorithmCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ 
  title, 
  description, 
  icon, 
  isActive, 
  onClick 
}) => {
  return (
    <div 
      className={`p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-blue-50 border-2 border-blue-500 transform scale-[1.02]' 
          : 'bg-white hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-md ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
          {icon}
        </div>
        <div className="ml-3">
          <h3 className={`font-semibold ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmCard;