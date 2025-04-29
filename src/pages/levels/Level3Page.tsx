import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Check, X, ArrowRight, Globe, Mail } from 'lucide-react';
import Confetti from 'react-confetti';
import VideoPlayer from '../../components/VideoPlayer';
import CountryTheme from '../../components/CountryTheme';
import { useGameStore, canAccessLevel } from '../../store/gameStore';

// Types for sorting game
interface SystemItem {
  id: string;
  name: string;
  description: string;
  isUAReady: boolean;
  image: React.ReactNode;
}

const Level3Page: React.FC = () => {
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
  const [currentItem, setCurrentItem] = useState<SystemItem | null>(null);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<{message: string, correct: boolean} | null>(null);
  const [remainingItems, setRemainingItems] = useState<SystemItem[]>([]);
  
  const levelId = 3;
  const country = 'Germany';
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
      setRemainingItems([...systemItems]);
      nextItem();
    }
  }, [isCompleted, gameCompleted]);
  
  const nextItem = () => {
    if (remainingItems.length === 0) {
      setGameCompleted(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * remainingItems.length);
    setCurrentItem(remainingItems[randomIndex]);
    setRemainingItems(prev => prev.filter((_, i) => i !== randomIndex));
    setFeedback(null);
  };
  
  const handleAnswer = (answer: boolean) => {
    if (currentItem) {
      const isCorrect = answer === currentItem.isUAReady;
      setAttempts(prev => prev + 1);
      
      if (isCorrect) {
        setScore(prev => prev + 1);
        setFeedback({
          message: `Correct! ${currentItem.name} ${currentItem.isUAReady ? 'is' : 'is not'} UA-ready.`,
          correct: true
        });
      } else {
        setFeedback({
          message: `Incorrect. ${currentItem.name} ${currentItem.isUAReady ? 'is' : 'is not'} UA-ready.`,
          correct: false
        });
      }
      
      // Move to next item after 1.5 seconds
      setTimeout(() => {
        nextItem();
      }, 1500);
    }
  };
  
  const handleLevelComplete = () => {
    completeCountry(levelId, country);
    completeLevel(levelId);
    unlockBadge('europe-badge');
    earnXP(150);
    setShowSuccess(true);
  };
  
  const handleContinue = () => {
    navigate('/level/4');
  };
  
  // Calculate success rate
  const successRate = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  const isPassing = successRate >= 70; // 70% or better to pass
  
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
                <h1 className="text-2xl font-bold">Level 3: Europe - "Ready or Not?" Sorting Game</h1>
                <p className="mt-2">Your mission takes you to Germany, where you'll need to evaluate systems for Universal Acceptance readiness.</p>
              </div>
              
              {!isCompleted ? (
                <div className="p-6">
                  <div className="mb-8">
                    <VideoPlayer 
                      videoPlaceholder={true}
                      title="Welcome to Germany!"
                      description="Your NPC guide will introduce you to the challenges of identifying UA-ready systems."
                      countryName={country}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Mission Background
                    </h2>
                    <p className="text-gray-600 mb-4">
                      In Germany, a major technology company is upgrading their systems to be Universal Acceptance ready. 
                      They need your help to identify which systems already support internationalized domain names and 
                      email addresses, and which need to be updated.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Your task is to sort various systems into "UA-Ready" and "Not UA-Ready" categories based on their capabilities.
                    </p>
                  </div>
                  
                  {!gameCompleted ? (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                        Is this system UA-Ready?
                      </h3>
                      
                      {currentItem && (
                        <motion.div
                          key={currentItem.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white p-6 rounded-lg shadow mb-6"
                        >
                          <div className="flex items-center mb-4">
                            <div className="mr-4 p-3 bg-primary-100 rounded-full">
                              {currentItem.image}
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900">
                              {currentItem.name}
                            </h4>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {currentItem.description}
                          </p>
                        </motion.div>
                      )}
                      
                      <div className="flex justify-center space-x-4 mb-4">
                        <button
                          className="btn bg-green-500 hover:bg-green-600 text-white flex items-center"
                          onClick={() => handleAnswer(true)}
                          disabled={!!feedback}
                        >
                          <Check className="mr-2 h-5 w-5" />
                          UA-Ready
                        </button>
                        <button
                          className="btn bg-red-500 hover:bg-red-600 text-white flex items-center"
                          onClick={() => handleAnswer(false)}
                          disabled={!!feedback}
                        >
                          <X className="mr-2 h-5 w-5" />
                          Not UA-Ready
                        </button>
                      </div>
                      
                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 rounded-lg ${
                            feedback.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                          }`}
                        >
                          <div className="flex items-center">
                            {feedback.correct ? (
                              <Check className="h-5 w-5 mr-2" />
                            ) : (
                              <X className="h-5 w-5 mr-2" />
                            )}
                            <p>{feedback.message}</p>
                          </div>
                        </motion.div>
                      )}
                      
                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                          Progress: {10 - remainingItems.length} / 10
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-primary-600 h-2.5 rounded-full"
                            style={{ width: `${((10 - remainingItems.length) / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-block p-4 bg-primary-100 rounded-full mb-6">
                        {isPassing ? (
                          <Award className="h-16 w-16 text-primary-600" />
                        ) : (
                          <X className="h-16 w-16 text-red-600" />
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {isPassing ? 'Challenge Completed!' : 'Try Again'}
                      </h3>
                      
                      <p className="text-lg text-gray-600 mb-2">
                        You identified {score} out of {attempts} systems correctly.
                      </p>
                      
                      <p className="text-xl font-medium mb-6">
                        Success Rate: {successRate}%
                      </p>
                      
                      {isPassing ? (
                        <button
                          className="btn btn-primary"
                          onClick={handleLevelComplete}
                        >
                          Claim Your Badge
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-red-600">
                            You need at least 70% success rate to pass.
                          </p>
                          <button
                            className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => {
                              setScore(0);
                              setAttempts(0);
                              setGameCompleted(false);
                              setRemainingItems([...systemItems]);
                              nextItem();
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
                    Congratulations! You've helped the German technology company 
                    identify which systems need UA updates.
                  </p>
                  
                  <div className="inline-block badge badge-success mb-6">
                    +150 XP Earned
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      className="btn btn-primary"
                      onClick={handleContinue}
                    >
                      Continue to North America
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
                  Europe UA Ambassador Badge Earned!
                </h3>
                
                <p className="text-green-700 mb-4">
                  You've successfully helped implement UA readiness standards in Germany.
                  Level 4 has been unlocked!
                </p>
                
                <button
                  className="btn btn-primary"
                  onClick={handleContinue}
                >
                  Continue to North America
                </button>
              </motion.div>
            )}
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About Germany and Universal Acceptance
                </h2>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                      <Globe className="h-12 w-12 text-primary-600" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-4">
                      Germany is one of Europe's leading technology hubs and has a strong tradition 
                      of internationalization and standards compliance. With a diverse population including 
                      many immigrants from non-Latin script regions, Universal Acceptance is essential 
                      for digital inclusion.
                    </p>
                    
                    <p className="text-gray-600 mb-4">
                      The country has its own TLD (.de) and uses mainly Latin script, but 
                      German businesses often interact with customers and partners worldwide, 
                      making UA readiness important for international commerce.
                    </p>
                    
                    <p className="text-gray-600">
                      By implementing UA-ready systems, German companies can better serve 
                      global markets and support the linguistic diversity of their user base.
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

// System items for the sorting game
const systemItems: SystemItem[] = [
  {
    id: "system1",
    name: "Modern Email Server (2023)",
    description: "A recently updated email server with SMTPUTF8 support and Unicode storage",
    isUAReady: true,
    image: <Mail className="h-6 w-6 text-primary-600" />
  },
  {
    id: "system2",
    name: "Legacy Contact Form",
    description: "A web form built in 2010 that validates email addresses using ASCII-only regex patterns",
    isUAReady: false,
    image: <FormIcon className="h-6 w-6 text-primary-600" />
  },
  {
    id: "system3",
    name: "Internationalized CRM System",
    description: "A customer relationship management system that supports storage and display of Unicode in all fields",
    isUAReady: true,
    image: <Users className="h-6 w-6 text-primary-600" />
  },
  {
    id: "system4",
    name: "Domain Registration System",
    description: "A domain registration system that only accepts ASCII characters for domains",
    isUAReady: false,
    image: <Globe className="h-6 w-6 text-primary-600" />
  },
  {
    id: "system5",
    name: "Modern Web Browser",
    description: "The latest version of a popular web browser with IDN support and Unicode rendering",
    isUAReady: true,
    image: <Browser className="h-6 w-6 text-primary-600" />
  },
  {
    id: "system6",
    name: "Legacy Database (2008)",
    description: "An older database system that stores all strings as ASCII and requires conversion for other scripts",
    isUAReady: false,
    image: <Database className="h-6 w-6 text-primary-600" />
  },
  {
    id: "system7",
    name: "Multilingual Mobile App",
    description: "A mobile application that validates and displays user information in any script",
    isUAReady: true,
    image: <Smartphone className="h-6 w-6 text-primary-600" />
  },
  {
    id: "system8",
    name: "Email Validation Library",
    description: "A JavaScript validation library that supports EAI standards and Unicode",
    isUAReady: true,
    image: <Code className="h-6 w-6 text-primary-600" />
  },
  {
    id: "system9",
    name: "Legacy Email Client",
    description: "An email client from 2012 that displays Punycode instead of rendered Unicode for IDNs",
    isUAReady: false,
    image: <Mail className="h-6 w-6 text-primary-600" />
  },
  {
    id: "system10",
    name: "Modern Web Framework",
    description: "A web development framework with built-in internationalization support",
    isUAReady: true,
    image: <Code className="h-6 w-6 text-primary-600" />
  }
];

// Icon components
function FormIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="9" x2="15" y2="9"></line>
      <line x1="9" y1="13" x2="15" y2="13"></line>
      <line x1="9" y1="17" x2="15" y2="17"></line>
    </svg>
  );
}

function Users(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function Browser(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  );
}

function Database(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  );
}

function Smartphone(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
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

export default Level3Page;