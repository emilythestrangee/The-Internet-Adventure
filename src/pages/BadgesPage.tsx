import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import BadgeDisplay from '../components/BadgeDisplay';
import { useGameStore, getPlayerLevel } from '../store/gameStore';

const BadgesPage: React.FC = () => {
  const { badges, xp, level } = useGameStore();
  const playerRank = getPlayerLevel();
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const nextLevelXP = level * 500;
  const currentLevelXP = (level - 1) * 500;
  const levelProgress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const badgeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
            Your UA Ambassador Badges
          </h1>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <div className="ml-4 text-white">
                    <h2 className="text-xl font-bold">
                      {playerRank}
                    </h2>
                    <p className="text-white/80">
                      Level {level} • {unlockedBadges.length}/{badges.length} Badges
                    </p>
                  </div>
                </div>
                
                <div className="w-full sm:w-48 bg-white/20 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-white h-4"
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between text-white/80 text-sm">
                <span>{xp} XP</span>
                <span>{nextLevelXP} XP</span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Your Collection
              </h3>
              
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {badges.map((badge) => (
                  <motion.div key={badge.id} variants={badgeVariants}>
                    <BadgeDisplay badge={badge} size="md" showDetails={true} />
                  </motion.div>
                ))}
              </motion.div>
              
              {unlockedBadges.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">No badges yet</p>
                  <p className="mt-1">Complete levels to earn badges!</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Badge Ranks
              </h3>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${level >= 4 ? 'bg-purple-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      level >= 4 ? 'bg-purple-100' : 'bg-gray-200'
                    }`}>
                      <Award className={`h-6 w-6 ${
                        level >= 4 ? 'text-purple-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h4 className={`font-medium ${
                        level >= 4 ? 'text-purple-800' : 'text-gray-700'
                      }`}>
                        Ambassador
                      </h4>
                      <p className={`text-sm ${
                        level >= 4 ? 'text-purple-600' : 'text-gray-500'
                      }`}>
                        Level 4 • Collect 6-7 badges
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${level >= 3 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      level >= 3 ? 'bg-blue-100' : 'bg-gray-200'
                    }`}>
                      <Award className={`h-6 w-6 ${
                        level >= 3 ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h4 className={`font-medium ${
                        level >= 3 ? 'text-blue-800' : 'text-gray-700'
                      }`}>
                        Champion
                      </h4>
                      <p className={`text-sm ${
                        level >= 3 ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        Level 3 • Collect 4-5 badges
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${level >= 2 ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      level >= 2 ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      <Award className={`h-6 w-6 ${
                        level >= 2 ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h4 className={`font-medium ${
                        level >= 2 ? 'text-green-800' : 'text-gray-700'
                      }`}>
                        Explorer
                      </h4>
                      <p className={`text-sm ${
                        level >= 2 ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        Level 2 • Collect 2-3 badges
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${level >= 1 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      level >= 1 ? 'bg-yellow-100' : 'bg-gray-200'
                    }`}>
                      <Award className={`h-6 w-6 ${
                        level >= 1 ? 'text-yellow-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h4 className={`font-medium ${
                        level >= 1 ? 'text-yellow-800' : 'text-gray-700'
                      }`}>
                        Trainee
                      </h4>
                      <p className={`text-sm ${
                        level >= 1 ? 'text-yellow-600' : 'text-gray-500'
                      }`}>
                        Level 1 • Collect 0-1 badges
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BadgesPage;