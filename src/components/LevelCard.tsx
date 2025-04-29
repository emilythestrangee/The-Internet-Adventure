import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, CheckCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface LevelCardProps {
  levelId: number;
  title: string;
  description: string;
  countries: string[];
  continent: string;
}

const LevelCard: React.FC<LevelCardProps> = ({
  levelId,
  title,
  description,
  countries,
  continent
}) => {
  const navigate = useNavigate();
  const { levels, badges } = useGameStore();
  
  const level = levels.find(l => l.id === levelId);
  const isUnlocked = level?.unlocked || false;
  const isCompleted = level?.completed || false;
  
  const badge = badges.find(b => b.continent === continent);
  const hasBadge = badge?.unlocked || false;
  
  const handleClick = () => {
    if (isUnlocked) {
      navigate(`/level/${levelId}`);
    }
  };
  
  // Continent-specific colors
  const continentColors: Record<string, { bg: string, text: string }> = {
    'Africa': { bg: 'bg-yellow-50', text: 'text-yellow-800' },
    'Asia': { bg: 'bg-green-50', text: 'text-green-800' },
    'Europe': { bg: 'bg-blue-50', text: 'text-blue-800' },
    'North America': { bg: 'bg-red-50', text: 'text-red-800' },
    'South America': { bg: 'bg-emerald-50', text: 'text-emerald-800' },
    'Australia': { bg: 'bg-cyan-50', text: 'text-cyan-800' },
    'Antarctica': { bg: 'bg-indigo-50', text: 'text-indigo-800' },
  };
  
  const { bg, text } = continentColors[continent] || { bg: 'bg-gray-50', text: 'text-gray-800' };
  
  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.02, y: -5 } : {}}
      className={`relative overflow-hidden rounded-lg shadow-md ${
        isUnlocked ? 'cursor-pointer bg-white' : 'cursor-not-allowed bg-gray-100'
      }`}
      onClick={handleClick}
    >
      {isCompleted && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 transform rotate-0 origin-top-right">
          COMPLETED
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
              {continent}
            </span>
            <h3 className={`mt-2 text-xl font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
              {title}
            </h3>
          </div>
          
          <div className="text-2xl font-bold text-gray-300">
            {levelId}
          </div>
        </div>
        
        <p className={`mt-2 text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>
        
        <div className="mt-4">
          <h4 className={`text-sm font-medium ${isUnlocked ? 'text-gray-700' : 'text-gray-400'}`}>
            Countries:
          </h4>
          <div className="mt-1 flex flex-wrap gap-2">
            {countries.map(country => (
              <span 
                key={country}
                className={`inline-block px-2 py-1 rounded text-xs ${
                  isUnlocked 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className={`border-t ${isUnlocked ? 'border-gray-200' : 'border-gray-300'} p-4 flex justify-between items-center`}>
        <div className="flex items-center">
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          ) : isUnlocked ? (
            <span className="text-sm text-primary-600 font-medium">Start Level</span>
          ) : (
            <Lock className="h-5 w-5 text-gray-400 mr-2" />
          )}
          
          {!isUnlocked && (
            <span className="text-sm text-gray-500">
              Complete previous level to unlock
            </span>
          )}
          
          {isCompleted && (
            <span className="text-sm text-green-600 font-medium">Level Complete</span>
          )}
        </div>
        
        {isUnlocked && (
          <ChevronRight className={`h-5 w-5 ${isCompleted ? 'text-green-500' : 'text-primary-500'}`} />
        )}
      </div>
    </motion.div>
  );
};

export default LevelCard;