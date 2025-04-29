import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Search, BugOff, AlertTriangle, Globe, Check } from 'lucide-react';
import Confetti from 'react-confetti';
import VideoPlayer from '../../components/VideoPlayer';
import CountryTheme from '../../components/CountryTheme';
import { useGameStore, canAccessLevel } from '../../store/gameStore';

// Bug Hunt game types
interface Bug {
  id: string;
  type: string;
  description: string;
  x: number;
  y: number;
  found: boolean;
}

const Level6Page: React.FC = () => {
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
  
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [foundBugs, setFoundBugs] = useState<Bug[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [timer, setTimer] = useState<number>(180); // 3 minutes in seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  
  const levelId = 6;
  const country = 'Australia';
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
      // Randomize bug positions
      const initialBugs = uaBugs.map(bug => ({
        ...bug,
        // Generate random positions within the mockup
        x: Math.random() * 90 + 5, // 5% to 95% horizontally
        y: Math.random() * 80 + 10, // 10% to 90% vertically
        found: false
      }));
      
      setBugs(initialBugs);
      setFoundBugs([]);
      setTimer(180);
      setIsActive(false);
    }
  }, [isCompleted, gameCompleted]);
  
  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timer > 0) {
      interval = window.setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      // Time's up!
      endGame();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer]);
  
  const startGame = () => {
    setIsActive(true);
  };
  
  const endGame = () => {
    setIsActive(false);
    setGameCompleted(true);
    
    // Check if player found enough bugs
    const foundCount = foundBugs.length;
    const totalBugs = bugs.length;
    const successRate = (foundCount / totalBugs) * 100;
    
    if (successRate >= 70) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };
  
  const handleBugClick = (bug: Bug) => {
    if (!isActive || bug.found) return;
    
    // Mark bug as found
    const updatedBugs = bugs.map(b => 
      b.id === bug.id ? { ...b, found: true } : b
    );
    
    setBugs(updatedBugs);
    setFoundBugs(prev => [...prev, bug]);
    setSelectedBug(bug);
    
    setFeedback(`Good job! You found a ${bug.type} bug.`);
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
    
    // Check if all bugs are found
    if (updatedBugs.every(b => b.found)) {
      endGame();
    }
  };
  
  const handleLevelComplete = () => {
    completeCountry(levelId, country);
    completeLevel(levelId);
    unlockBadge('australia-badge');
    earnXP(150);
    setShowSuccess(true);
  };
  
  const handleContinue = () => {
    navigate('/level/7');
  };
  
  // Format timer
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Calculate success rate
  const foundCount = foundBugs.length;
  const totalBugs = bugs.length;
  const successRate = totalBugs > 0 ? Math.round((foundCount / totalBugs) * 100) : 0;
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
                <h1 className="text-2xl font-bold">Level 6: Australia - Bug Reporting Hunt</h1>
                <p className="mt-2">Your mission takes you to Australia, where you'll search for Universal Acceptance bugs to report.</p>
              </div>
              
              {!isCompleted ? (
                <div className="p-6">
                  <div className="mb-8">
                    <VideoPlayer 
                      videoPlaceholder={true}
                      title="Welcome to Australia!"
                      description="Your NPC guide will explain your mission to find and report UA bugs in websites."
                      countryName={country}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Mission Background
                    </h2>
                    <p className="text-gray-600 mb-4">
                      In Australia, a government digital services team is working to make their websites 
                      more accessible to the diverse population, including many immigrants who use non-Latin 
                      scripts in their names and email addresses.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Your task is to find UA-related bugs in their website mockups before they go live. 
                      Click on any issues you find to report them.
                    </p>
                  </div>
                  
                  {!gameCompleted ? (
                    <div>
                      <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Bug Hunt Challenge
                          </h3>
                          {isActive ? (
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              timer < 30 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              Time: {formatTime(timer)}
                            </div>
                          ) : (
                            <button
                              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                              onClick={startGame}
                            >
                              Start Hunt
                            </button>
                          )}
                        </div>
                        
                        {!isActive && foundBugs.length === 0 && (
                          <div className="text-center py-8">
                            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Find Universal Acceptance bugs in the website mockup</p>
                            <p className="text-sm text-gray-500 mt-1">Click the Start button when you're ready</p>
                            <p className="text-xs text-gray-400 mt-4">You have 3 minutes to find as many bugs as possible</p>
                          </div>
                        )}
                        
                        {(isActive || foundBugs.length > 0) && (
                          <div className="relative border border-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                            {/* Website Mockup */}
                            <div className="absolute inset-0 bg-white">
                              {/* Header */}
                              <div className="h-12 bg-blue-600 flex items-center px-4">
                                <div className="text-white font-medium">Australian Government Services</div>
                              </div>
                              
                              {/* Navigation */}
                              <div className="h-10 bg-blue-700 flex items-center px-4 text-sm">
                                <div className="text-white mr-4">Home</div>
                                <div className="text-white mr-4">Services</div>
                                <div className="text-white mr-4">Forms</div>
                                <div className="text-white">Contact</div>
                              </div>
                              
                              {/* Content */}
                              <div className="p-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Create Your Account</h2>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <div className="h-8 bg-gray-100 rounded border border-gray-300"></div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <div className="h-8 bg-gray-100 rounded border border-gray-300"></div>
                                  </div>
                                </div>
                                
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                  <div className="h-8 bg-gray-100 rounded border border-gray-300"></div>
                                </div>
                                
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                  <div className="h-8 bg-gray-100 rounded border border-gray-300"></div>
                                </div>
                                
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Website (optional)</label>
                                  <div className="h-8 bg-gray-100 rounded border border-gray-300"></div>
                                </div>
                                
                                <div className="h-8 w-32 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-medium">
                                  Register
                                </div>
                              </div>
                            </div>
                            
                            {/* Bugs to find */}
                            {bugs.map((bug) => (
                              <button
                                key={bug.id}
                                className={`absolute w-6 h-6 rounded-full flex items-center justify-center ${
                                  bug.found ? 'bg-green-500 cursor-default' : 'bg-transparent cursor-pointer hover:bg-red-200/50'
                                }`}
                                style={{ 
                                  left: `${bug.x}%`, 
                                  top: `${bug.y}%`,
                                  transform: 'translate(-50%, -50%)'
                                }}
                                onClick={() => handleBugClick(bug)}
                              >
                                {bug.found && <Check className="h-4 w-4 text-white" />}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {feedback && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm"
                          >
                            {feedback}
                          </motion.div>
                        )}
                        
                        {isActive && (
                          <div className="mt-4">
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                              <span>Bugs found: {foundBugs.length} / {totalBugs}</span>
                              <span>Progress: {Math.round((foundBugs.length / totalBugs) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(foundBugs.length / totalBugs) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {selectedBug && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                            Bug Details
                          </h3>
                          <p className="text-sm text-gray-700 font-medium mb-1">Type: {selectedBug.type}</p>
                          <p className="text-sm text-gray-600">{selectedBug.description}</p>
                        </div>
                      )}
                      
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="font-medium text-gray-900">Reported Bugs</h3>
                        </div>
                        
                        <div className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                          {foundBugs.length > 0 ? (
                            foundBugs.map((bug) => (
                              <div key={bug.id} className="p-3 flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                  <BugOff className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{bug.type}</p>
                                  <p className="text-xs text-gray-500 mt-1">{bug.description}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              No bugs reported yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-block p-4 rounded-full mb-6 bg-blue-100">
                        {isPassing ? (
                          <BugOff className="h-16 w-16 text-blue-600" />
                        ) : (
                          <AlertTriangle className="h-16 w-16 text-amber-600" />
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Bug Hunt Results
                      </h3>
                      
                      <div className="mb-6 mx-auto w-24 h-24 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              className="text-gray-200"
                              strokeWidth="8"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                            <circle
                              className={`${isPassing ? 'text-green-500' : 'text-amber-500'}`}
                              strokeWidth="8"
                              strokeDasharray={Math.ceil(2 * Math.PI * 40)}
                              strokeDashoffset={Math.ceil(2 * Math.PI * 40 * (1 - successRate / 100))}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold">{foundCount}</span>
                            <span className="text-xs text-gray-500">/ {totalBugs}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-lg font-medium text-gray-800 mb-4">
                        {isPassing 
                          ? "Great job! You found most of the bugs!" 
                          : "You missed several important bugs."}
                      </p>
                      
                      <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        {isPassing
                          ? "Thanks to your bug reports, the Australian government website will be much more inclusive for users with international domain names and email addresses."
                          : "Finding and reporting UA bugs is crucial for making websites more inclusive. Try again to catch more issues."}
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
                          <p className="text-amber-600">
                            You need to find at least 70% of the bugs to pass.
                          </p>
                          <button
                            className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => {
                              // Reset game
                              const initialBugs = uaBugs.map(bug => ({
                                ...bug,
                                x: Math.random() * 90 + 5,
                                y: Math.random() * 80 + 10,
                                found: false
                              }));
                              
                              setBugs(initialBugs);
                              setFoundBugs([]);
                              setSelectedBug(null);
                              setTimer(180);
                              setIsActive(false);
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
                    Congratulations! You've successfully identified and reported 
                    Universal Acceptance bugs in the Australian government website.
                  </p>
                  
                  <div className="inline-block badge badge-success mb-6">
                    +150 XP Earned
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      className="btn btn-primary"
                      onClick={handleContinue}
                    >
                      Continue to Antarctica
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
                  Australia UA Ambassador Badge Earned!
                </h3>
                
                <p className="text-green-700 mb-4">
                  You've successfully identified and reported Universal Acceptance bugs in Australia.
                  Level 7 has been unlocked!
                </p>
                
                <button
                  className="btn btn-primary"
                  onClick={handleContinue}
                >
                  Continue to Antarctica
                </button>
              </motion.div>
            )}
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About Australia and Universal Acceptance
                </h2>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                      <Globe className="h-12 w-12 text-primary-600" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-4">
                      Australia is one of the most multicultural countries in the world, with over 
                      7.5 million people born overseas and many more from diverse cultural backgrounds. 
                      This diversity makes Universal Acceptance particularly important for digital inclusion.
                    </p>
                    
                    <p className="text-gray-600 mb-4">
                      The .au TLD serves Australia, but supporting characters from the many languages 
                      spoken by Australian residents - including Chinese, Arabic, Greek, Vietnamese, and 
                      many Indigenous languages - is crucial for truly inclusive digital services.
                    </p>
                    
                    <p className="text-gray-600">
                      Australian government services are increasingly focused on digital accessibility, 
                      making UA implementation important for ensuring that all residents can access 
                      essential services regardless of their preferred language or script.
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

// UA Bugs to find
const uaBugs: Omit<Bug, 'x' | 'y' | 'found'>[] = [
  {
    id: "bug1",
    type: "Email Validation Bug",
    description: "The email field uses regex that only accepts ASCII characters, rejecting valid internationalized email addresses."
  },
  {
    id: "bug2",
    type: "IDN Display Bug",
    description: "The website displays punycode instead of rendered Unicode for internationalized domain names."
  },
  {
    id: "bug3",
    type: "Form Submission Bug",
    description: "The form rejects submissions with internationalized domain names in the website field."
  },
  {
    id: "bug4",
    type: "Name Field Bug",
    description: "Name fields restrict input to Latin characters, preventing users from entering names in their native scripts."
  },
  {
    id: "bug5",
    type: "Data Storage Bug",
    description: "User data is stored with improper encoding, causing corruption of non-ASCII characters."
  },
  {
    id: "bug6",
    type: "Error Message Bug",
    description: "Error messages incorrectly state that email addresses with non-ASCII characters are invalid."
  },
  {
    id: "bug7",
    type: "URL Handling Bug",
    description: "The system doesn't properly handle URLs with internationalized domain names when linking to external sites."
  },
  {
    id: "bug8",
    type: "Password Validation Bug",
    description: "Password field rejects valid Unicode characters, limiting security options for users."
  },
  {
    id: "bug9",
    type: "Browser Detection Bug",
    description: "The site warns users on certain browsers that IDNs aren't supported, even when they are."
  },
  {
    id: "bug10",
    type: "Accessibility Bug",
    description: "Screen readers cannot properly interpret internationalized domain names due to improper markup."
  }
];

export default Level6Page;