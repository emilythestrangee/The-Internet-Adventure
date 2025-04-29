import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Briefcase, ArrowUp, User, Star } from 'lucide-react';
import Confetti from 'react-confetti';
import VideoPlayer from '../../components/VideoPlayer';
import CountryTheme from '../../components/CountryTheme';
import { useGameStore, canAccessLevel } from '../../store/gameStore';

// Career ladder game types
interface CareerTask {
  id: string;
  title: string;
  description: string;
  isUAPositive: boolean;
  points: number;
}

interface CareerLevel {
  title: string;
  requiredPoints: number;
  icon: React.ReactNode;
  color: string;
}

const Level4Page: React.FC = () => {
  const navigate = useNavigate();
  const { 
    completeLevel, 
    unlockBadge, 
    earnXP,
    completeCountry,
    setCurrentLevel,
    levels
  } = useGameStore();
  
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [careerPoints, setCareerPoints] = useState<number>(0);
  const [availableTasks, setAvailableTasks] = useState<CareerTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CareerTask[]>([]);
  const [currentLevel, setCurrentCareerLevel] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const levelId = 4;
  const country = 'Mexico';
  const level = levels.find(l => l.id === levelId);
  const isCompleted = level?.completed || false;
  
  useEffect(() => {
    // Check if user can access this level
    if (!canAccessLevel(levelId)) {
      navigate('/');
      return;
    }
    
    setCurrentLevel(levelId);
    return () => setCurrentLevel(null);
  }, [navigate, setCurrentLevel]);
  
  // Initialize game
  useEffect(() => {
    if (!isCompleted && !gameCompleted) {
      setAvailableTasks([...careerTasks]);
      setCompletedTasks([]);
      setCareerPoints(0);
      setCurrentCareerLevel(0);
    }
  }, [isCompleted, gameCompleted]);
  
  const handleTaskChoice = (task: CareerTask) => {
    // Add points
    const newPoints = careerPoints + task.points;
    setCareerPoints(newPoints);
    
    // Move task from available to completed
    setAvailableTasks(prev => prev.filter(t => t.id !== task.id));
    setCompletedTasks(prev => [...prev, task]);
    
    // Display feedback
    setFeedback(
      task.isUAPositive
        ? `Great choice! Implementing ${task.title} helps with Universal Acceptance.`
        : `This choice doesn't help with Universal Acceptance. Your career progress is slower.`
    );
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
    
    // Update career level based on points
    for (let i = careerLevels.length - 1; i >= 0; i--) {
      if (newPoints >= careerLevels[i].requiredPoints) {
        setCurrentCareerLevel(i);
        break;
      }
    }
    
    // Check if game is completed
    if (availableTasks.length === 1) { // This is the last task
      setTimeout(() => {
        setGameCompleted(true);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }, 1000);
    }
  };
  
  const handleLevelComplete = () => {
    completeCountry(levelId, country);
    completeLevel(levelId);
    unlockBadge('north-america-badge');
    earnXP(150);
    setShowSuccess(true);
  };
  
  const handleContinue = () => {
    navigate('/level/5');
  };
  
  // Check if player has reached a senior level
  const isSeniorOrHigher = currentLevel >= 3; // Senior, Lead, or Director
  
  // Get current career level details
  const currentCareerLevel = careerLevels[currentLevel];
  
  return (
    <CountryTheme countryName={country}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                <h1 className="text-2xl font-bold">Level 4: North America - Career Ladder Game</h1>
                <p className="mt-2">Your mission takes you to Mexico, where implementing UA can boost your tech career.</p>
              </div>
              
              {!isCompleted ? (
                <div className="p-6">
                  <div className="mb-8">
                    <VideoPlayer 
                      videoPlaceholder={true}
                      title="Welcome to Mexico!"
                      description="Your NPC guide will introduce you to how Universal Acceptance skills can benefit your tech career."
                      countryName={country}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Mission Background
                    </h2>
                    <p className="text-gray-600 mb-4">
                      In Mexico, a major technology company is looking to enhance its global reach. 
                      You've been hired as a developer and have the opportunity to make career choices 
                      that demonstrate the professional benefits of implementing Universal Acceptance.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Your task is to climb the career ladder by making smart choices about Universal Acceptance implementation.
                    </p>
                  </div>
                  
                  {!gameCompleted ? (
                    <div>
                      <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Your Career Progress
                          </h3>
                          <div className="px-3 py-1 rounded-full text-sm font-medium" style={{ 
                            backgroundColor: currentCareerLevel.color + '33',
                            color: currentCareerLevel.color
                          }}>
                            {currentCareerLevel.title}
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex-shrink-0 mr-4">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ 
                              backgroundColor: currentCareerLevel.color + '33' 
                            }}>
                              {currentCareerLevel.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="h-2.5 rounded-full transition-all duration-1000"
                                style={{ 
                                  width: `${Math.min((careerPoints / 1000) * 100, 100)}%`,
                                  backgroundColor: currentCareerLevel.color
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{careerPoints} points</span>
                              <span>Next: {
                                currentLevel < careerLevels.length - 1 
                                  ? careerLevels[currentLevel + 1].requiredPoints 
                                  : 'Max Level'
                              }</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Career Ladder:</h4>
                          <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin">
                            {careerLevels.map((careerLevel, index) => (
                              <div 
                                key={index}
                                className={`flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-lg ${
                                  currentLevel >= index ? 'opacity-100' : 'opacity-50'
                                }`}
                                style={{ 
                                  backgroundColor: index <= currentLevel ? careerLevel.color + '22' : 'transparent'
                                }}
                              >
                                <div 
                                  className="h-8 w-8 rounded-full flex items-center justify-center mb-1"
                                  style={{ 
                                    backgroundColor: index <= currentLevel ? careerLevel.color + '33' : 'transparent',
                                    color: careerLevel.color
                                  }}
                                >
                                  {careerLevel.icon}
                                </div>
                                <span className="text-xs font-medium" style={{ 
                                  color: index <= currentLevel ? careerLevel.color : 'gray'
                                }}>
                                  {careerLevel.title}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {careerLevel.requiredPoints}p
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg"
                        >
                          {feedback}
                        </motion.div>
                      )}
                      
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="font-medium text-gray-900">Available Career Choices</h3>
                          <p className="text-sm text-gray-600">Select your next career move:</p>
                        </div>
                        
                        <div className="divide-y divide-gray-200">
                          {availableTasks.slice(0, 3).map((task) => (
                            <motion.button
                              key={task.id}
                              className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start"
                              onClick={() => handleTaskChoice(task)}
                              whileHover={{ backgroundColor: '#f7fafc' }}
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              </div>
                              <div className="ml-4 mt-1 flex-shrink-0">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                  +{task.points} pts
                                </span>
                              </div>
                            </motion.button>
                          ))}
                          
                          {availableTasks.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                              No more tasks available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="font-medium text-gray-900">Your Career Achievements</h3>
                        </div>
                        
                        <div className="divide-y divide-gray-200">
                          {completedTasks.map((task) => (
                            <div key={task.id} className="p-4 flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                  task.isUAPositive ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                  {task.isUAPositive ? (
                                    <CheckIcon className="h-3 w-3" />
                                  ) : (
                                    <XIcon className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                              </div>
                              <div className="ml-3 flex-shrink-0">
                                <span className={`text-xs font-medium ${
                                  task.isUAPositive ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                  +{task.points} pts
                                </span>
                              </div>
                            </div>
                          ))}
                          
                          {completedTasks.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                              No achievements yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-block p-4 rounded-full mb-6" style={{ 
                        backgroundColor: currentCareerLevel.color + '22'
                      }}>
                        <div className="h-16 w-16" style={{ color: currentCareerLevel.color }}>
                          {currentCareerLevel.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Career Challenge Completed!
                      </h3>
                      
                      <p className="text-lg text-gray-600 mb-2">
                        You've reached the position of:
                      </p>
                      
                      <p className="text-2xl font-bold mb-6" style={{ color: currentCareerLevel.color }}>
                        {currentCareerLevel.title}
                      </p>
                      
                      <p className="text-lg text-gray-600 mb-6">
                        {isSeniorOrHigher 
                          ? "Congratulations! Your UA expertise has helped you reach a senior position."
                          : "You made some progress, but your career could benefit from more UA expertise."}
                      </p>
                      
                      {isSeniorOrHigher ? (
                        <button
                          className="btn btn-primary"
                          onClick={handleLevelComplete}
                        >
                          Claim Your Badge
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-amber-600">
                            You need to reach at least a Senior Developer position to pass.
                          </p>
                          <button
                            className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => {
                              setCareerPoints(0);
                              setAvailableTasks([...careerTasks]);
                              setCompletedTasks([]);
                              setCurrentCareerLevel(0);
                              setGameCompleted(false);
                            }}
                          >
                            Try Again
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                    <Award className="h-16 w-16 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Level Completed!
                  </h2>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    Congratulations! You've demonstrated the career benefits 
                    of Universal Acceptance expertise in Mexico.
                  </p>
                  
                  <div className="inline-block badge badge-success mb-6">
                    +150 XP Earned
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      className="btn btn-primary"
                      onClick={handleContinue}
                    >
                      Continue to South America
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center"
              >
                <div className="inline-block p-2 bg-green-100 rounded-full mb-4">
                  <Award className="h-10 w-10 text-green-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  North America UA Ambassador Badge Earned!
                </h3>
                
                <p className="text-green-700 mb-4">
                  You've successfully demonstrated the career benefits of Universal Acceptance expertise in Mexico.
                  Level 5 has been unlocked!
                </p>
                
                <button
                  className="btn btn-primary"
                  onClick={handleContinue}
                >
                  Continue to South America
                </button>
              </motion.div>
            )}
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About Mexico and Universal Acceptance
                </h2>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                      <Globe className="h-12 w-12 text-primary-600" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-4">
                      Mexico is the largest Spanish-speaking country in the world and has a rapidly growing 
                      technology sector. With increasingly international business connections, 
                      Universal Acceptance is becoming important for Mexican companies.
                    </p>
                    
                    <p className="text-gray-600 mb-4">
                      The .mx TLD serves the country, but Spanish language characters (like ñ) 
                      and indigenous language support are important for truly inclusive digital services.
                    </p>
                    
                    <p className="text-gray-600">
                      For technology professionals in Mexico, Universal Acceptance expertise 
                      represents a valuable skill set that can accelerate career advancement and 
                      provide opportunities to work with global companies and projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </CountryTheme>
  );
};

// Career tasks data
const careerTasks: CareerTask[] = [
  {
    id: "task1",
    title: "Implement IDN validation",
    description: "Update your company's form validation to support internationalized domain names",
    isUAPositive: true,
    points: 150
  },
  {
    id: "task2",
    title: "Ignore Unicode support request",
    description: "Delay implementing Unicode support for the login system",
    isUAPositive: false,
    points: 30
  },
  {
    id: "task3",
    title: "Present UA benefits to management",
    description: "Create a presentation on how Universal Acceptance can expand the company's market",
    isUAPositive: true,
    points: 180
  },
  {
    id: "task4",
    title: "Join email standardization committee",
    description: "Volunteer to represent your company on an email standards committee",
    isUAPositive: true,
    points: 200
  },
  {
    id: "task5",
    title: "Skip international test cases",
    description: "Focus only on ASCII test cases to finish faster",
    isUAPositive: false,
    points: 50
  },
  {
    id: "task6",
    title: "Develop EAI training course",
    description: "Create training materials on Email Address Internationalization for your team",
    isUAPositive: true,
    points: 170
  },
  {
    id: "task7",
    title: "Update database schema for Unicode",
    description: "Modify your company's database to properly store and index Unicode strings",
    isUAPositive: true,
    points: 160
  },
  {
    id: "task8",
    title: "Apply quick ASCII-only fix",
    description: "Implement a quick fix that only works for ASCII email addresses",
    isUAPositive: false,
    points: 40
  },
  {
    id: "task9",
    title: "Lead UA compliance initiative",
    description: "Take leadership of a cross-team initiative to ensure UA compliance",
    isUAPositive: true,
    points: 220
  },
  {
    id: "task10",
    title: "Cut corners on internationalization",
    description: "Skip proper internationalization to meet a deadline",
    isUAPositive: false,
    points: 60
  }
];

// Career levels data
const careerLevels: CareerLevel[] = [
  {
    title: "Junior Developer",
    requiredPoints: 0,
    icon: <User className="h-5 w-5" />,
    color: "#6B7280" // Gray
  },
  {
    title: "Developer",
    requiredPoints: 200,
    icon: <Code className="h-5 w-5" />,
    color: "#2563EB" // Blue
  },
  {
    title: "Senior Developer",
    requiredPoints: 400,
    icon: <Star className="h-5 w-5" />,
    color: "#7C3AED" // Purple
  },
  {
    title: "Lead Developer",
    requiredPoints: 600,
    icon: <Team className="h-5 w-5" />,
    color: "#059669" // Green
  },
  {
    title: "Director of Engineering",
    requiredPoints: 800,
    icon: <Briefcase className="h-5 w-5" />,
    color: "#D97706" // Amber
  }
];

// Icon components
function CheckIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function Code(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}

function Team(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

export default Level4Page;