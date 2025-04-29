import React from 'react';
import { motion } from 'framer-motion';
import { Award, Check, Lock } from 'lucide-react';
import type { Badge } from '../store/gameStore';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badge, 
  size = 'md',
  showDetails = false 
}) => {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const badgeColors: Record<string, string> = {
    'Africa': 'from-yellow-500 to-red-600',
    'Asia': 'from-green-500 to-teal-600',
    'Europe': 'from-blue-500 to-indigo-600',
    'North America': 'from-red-500 to-orange-600',
    'South America': 'from-green-500 to-yellow-600', 
    'Australia': 'from-blue-500 to-green-600',
    'Antarctica': 'from-cyan-500 to-blue-600',
  };
  
  const gradientColor = badgeColors[badge.continent] || 'from-purple-500 to-blue-600';
  
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        className={`relative rounded-full ${sizeClasses[size]} flex items-center justify-center 
        bg-gradient-to-br ${gradientColor} shadow-md`}
        whileHover={{ scale: 1.05 }}
        initial={badge.unlocked && !badge.unlockedAt ? { scale: 0 } : { scale: 1 }}
        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {badge.unlocked ? (
          <>
            <Award className="text-white h-1/2 w-1/2" />
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <Check className="h-3 w-3 text-white" />
            </div>
          </>
        ) : (
          <>
            <Award className="text-white/40 h-1/2 w-1/2" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="h-1/4 w-1/4 text-white" />
            </div>
          </>
        )}
      </motion.div>
      
      {showDetails && (
        <div className="mt-2 text-center">
          <p className={`font-medium ${textSizeClasses[size]} ${badge.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
            {badge.title}
          </p>
          {size !== 'sm' && (
            <p className={`${textSizeClasses[size === 'lg' ? 'md' : 'sm']} mt-1 ${badge.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
              {badge.description}
            </p>
          )}
          {badge.unlocked && badge.unlockedAt && (
            <p className="text-xs text-gray-400 mt-1">
              Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;