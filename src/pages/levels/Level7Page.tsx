import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Globe, Map, Briefcase, Users, Building, GraduationCap } from 'lucide-react';
import Confetti from 'react-confetti';
import VideoPlayer from '../../components/VideoPlayer';
import CountryTheme from '../../components/CountryTheme';
import { useGameStore, canAccessLevel } from '../../store/gameStore';

// World Expansion game types
interface Region {
  id: string;
  name: string;
  population: string;
  languages: string[];
  script: string;
  unlockedAt: number | null;
  benefits: string[];
  icon: React.ReactNode;
}

const Level7Page: React.FC = () => {
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
  
  const [regions, setRegions] = useState<Region[]>(worldRegions);
  const [unlockedRegions, setUnlockedRegions] = useState<number>(0);
  const [marketSize, setMarketSize] = useState<number>(0);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [feedbacks, setFeedbacks] = useState<{message: string, timestamp: number}[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const levelId = 7;
  const country = 'Research Station';
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
      resetGame();
    }
  }, [isCompleted, gameCompleted]);
  
  const resetGame = () => {
    setRegions(worldRegions.map(region => ({ ...region, unlockedAt: null })));
    setUnlockedRegions(0);
    setMarketSize(100); // Starting with a base market size
    setSelectedRegion(null);
    setFeedbacks([]);
    setGameStarted(false);
    setGameCompleted(false);
  };
  
  const handleUnlockRegion = (region: Region) => {
    if (!gameStarted) return;
    
    if (region.unlockedAt !== null) {
      setSelectedRegion(region);
      return;
    }
    
    // Unlock the region
    const timeNow = Date.now();
    const updatedRegions = regions.map(r => 
      r.id === region.id ? { ...r, unlockedAt: timeNow } : r
    );
    
    setRegions(updatedRegions);
    setUnlockedRegions(prev => prev + 1);
    
    // Calculate population impact (market size increase)
    const populationImpact = parseInt(region.population.replace(/[^0-9]/g, ''));
    setMarketSize(prev => prev + populationImpact);
    
    // Add feedback message
    addFeedback(`You've unlocked ${region.name} with ${region.script} support! Market size increased by ${populationImpact} million.`);
    
    // Select this region
    setSelectedRegion(region);
    
    // Check if all regions are unlocked
    if (unlockedRegions + 1 >= worldRegions.length) {
      // Small delay before showing completion
      setTimeout(() => {
        setGameCompleted(true);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }, 1000);
    }
  };
  
  const addFeedback = (message: string) => {
    setFeedbacks(prev => [...prev, { message, timestamp: Date.now() }].slice(-5)); // Keep last 5 messages
  };
  
  const handleStart = () => {
    setGameStarted(true);
    addFeedback("Welcome to the World Expansion Game! Unlock regions by supporting their scripts.");
  };
  
  const handleLevelComplete = () => {
    completeCountry(levelId, country);
    completeLevel(levelId);
    unlockBadge('antarctica-badge');
    earnXP(200);
    setShowSuccess(true);
  };
  
  const handleContinue = () => {
    navigate('/badges');
  };
  
  // Calculate completion percentage
  const completionPercentage = Math.round((unlockedRegions / worldRegions.length) * 100);
  
  return (
    <CountryTheme countryName={country}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                <h1 className="text-2xl font-bold">Level 7: Antarctica - World Expansion Game</h1>
                <p className="mt-2">Your final mission takes you to an international research station in Antarctica, where you'll demonstrate the global impact of Universal Acceptance.</p>
              </div>
              
              {!isCompleted ? (
                <div className="p-6">
                  <div className="mb-8">
                    <VideoPlayer 
                      videoPlaceholder={true}
                      title="Welcome to Antarctica!"
                      description="Your NPC guide will explain your final mission to unlock global markets through Universal Acceptance."
                      countryName={country}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Mission Background
                    </h2>
                    <p className="text-gray-600 mb-4">
                      At an international research station in Antarctica, scientists from around the world are 
                      collaborating on a project to understand the global impact of digital inclusion. 
                      They've invited you to demonstrate how Universal Acceptance can expand access 
                      to the internet for people worldwide.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Your task is to show how implementing UA unlocks new regions of the world, 
                      expanding market reach and improving global communication.
                    </p>
                  </div>
                  
                  {!gameCompleted ? (
                    <div>
                      {!gameStarted ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <Globe className="h-16 w-16 text-primary-600 mx-auto mb-6 animate-pulse" />
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            World Expansion Game
                          </h3>
                          <p className="text-gray-600 max-w-md mx-auto mb-8">
                            Demonstrate how Universal Acceptance unlocks new regions and markets by 
                            supporting different scripts and languages.
                          </p>
                          <button
                            className="btn btn-primary px-8"
                            onClick={handleStart}
                          >
                            Start Expansion
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2">
                            <div className="bg-gray-50 rounded-xl p-4 h-full">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                  Global Expansion Map
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {unlockedRegions} / {worldRegions.length} Regions
                                  </div>
                                  <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    {marketSize}M Users
                                  </div>
                                </div>
                              </div>
                              
                              <div className="relative p-4 border border-gray-200 rounded-lg bg-white overflow-hidden" style={{ minHeight: '360px' }}>
                                {/* World Map Visualization */}
                                <div className="absolute inset-0 opacity-20">
                                  <Map className="w-full h-full text-gray-400" />
                                </div>
                                
                                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                  {regions.map((region) => (
                                    <motion.button
                                      key={region.id}
                                      className={`p-4 rounded-lg ${
                                        selectedRegion?.id === region.id
                                          ? 'ring-2 ring-primary-500 bg-primary-50'
                                          : region.unlockedAt !== null
                                          ? 'bg-green-50 border border-green-200'
                                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                      }`}
                                      onClick={() => handleUnlockRegion(region)}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="flex flex-col items-center text-center">
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
                                          region.unlockedAt !== null 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-gray-200 text-gray-500'
                                        }`}>
                                          {region.icon}
                                        </div>
                                        <h4 className="font-medium text-gray-900">{region.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{region.script}</p>
                                        {region.unlockedAt !== null ? (
                                          <span className="mt-2 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                                            Unlocked
                                          </span>
                                        ) : (
                                          <span className="mt-2 px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                                            Click to Unlock
                                          </span>
                                        )}
                                      </div>
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                                  <span>Global Expansion:</span>
                                  <span>{completionPercentage}% Complete</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${completionPercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:col-span-1 space-y-6">
                            {selectedRegion && (
                              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                  <h3 className="font-medium text-gray-900">Region Details</h3>
                                </div>
                                
                                <div className="p-4">
                                  <div className="flex items-center mb-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                                      selectedRegion.unlockedAt !== null 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {selectedRegion.icon}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-900">{selectedRegion.name}</h4>
                                      <p className="text-sm text-gray-500">{selectedRegion.script}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3 text-sm">
                                    <div className="flex items-start">
                                      <Users className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                      <span className="text-gray-600">Population: {selectedRegion.population}</span>
                                    </div>
                                    <div className="flex items-start">
                                      <GraduationCap className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                      <span className="text-gray-600">Languages: {selectedRegion.languages.join(', ')}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4">
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">UA Implementation Benefits:</h5>
                                    <ul className="space-y-2">
                                      {selectedRegion.benefits.map((benefit, index) => (
                                        <motion.li 
                                          key={index} 
                                          className="flex items-start"
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: index * 0.1 }}
                                        >
                                          <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                          <span className="text-sm text-gray-600">{benefit}</span>
                                        </motion.li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  {selectedRegion.unlockedAt === null && (
                                    <button
                                      className="w-full mt-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
                                      onClick={() => handleUnlockRegion(selectedRegion)}
                                    >
                                      Unlock This Region
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                              <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <h3 className="font-medium text-gray-900">Expansion Journal</h3>
                              </div>
                              
                              <div className="p-4 max-h-60 overflow-y-auto">
                                {feedbacks.length > 0 ? (
                                  <div className="space-y-3">
                                    {feedbacks.map((feedback, index) => (
                                      <motion.div
                                        key={feedback.timestamp}
                                        className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                      >
                                        {feedback.message}
                                      </motion.div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center text-gray-500 py-4">
                                    <p>Start unlocking regions to see updates</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-block p-4 bg-primary-100 rounded-full mb-6">
                        <Globe className="h-16 w-16 text-primary-600" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Global Expansion Complete!
                      </h3>
                      
                      <p className="text-lg text-gray-600 mb-2">
                        You've successfully demonstrated how Universal Acceptance 
                        unlocks access to the internet for people worldwide!
                      </p>
                      
                      <div className="flex justify-center items-center space-x-3 mb-6">
                        <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full font-medium">
                          {marketSize}M Users Reached
                        </div>
                        <div className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full font-medium">
                          {worldRegions.length} Regions Unlocked
                        </div>
                      </div>
                      
                      <p className="text-gray-600 max-w-lg mx-auto mb-8">
                        By implementing Universal Acceptance, you've enabled people from diverse 
                        linguistic backgrounds to access digital services in their own languages and scripts.
                      </p>
                      
                      <button
                        className="btn btn-primary"
                        onClick={handleLevelComplete}
                      >
                        Claim Your Final Badge
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                    <Award className="h-16 w-16 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Adventure Completed!
                  </h2>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    Congratulations! You've completed all levels and demonstrated the 
                    global impact of Universal Acceptance. You are now a true UA Ambassador!
                  </p>
                  
                  <div className="inline-block badge badge-success mb-6">
                    +200 XP Earned
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      className="btn btn-primary"
                      onClick={handleContinue}
                    >
                      View All Your Badges
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
                  Antarctica UA Ambassador Badge Earned!
                </h3>
                
                <p className="text-green-700 mb-4">
                  You've successfully demonstrated the global impact of Universal Acceptance.
                  Congratulations on completing your UA Ambassador journey!
                </p>
                
                <button
                  className="btn btn-primary"
                  onClick={handleContinue}
                >
                  View All Your Badges
                </button>
              </motion.div>
            )}
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About Antarctica and Universal Acceptance
                </h2>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                      <Globe className="h-12 w-12 text-primary-600" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-4">
                      Antarctica represents a unique symbol of international cooperation, with research 
                      stations operated by scientists from many different countries. It's the perfect 
                      metaphor for the global collaboration needed to achieve Universal Acceptance.
                    </p>
                    
                    <p className="text-gray-600 mb-4">
                      While Antarctica itself doesn't have a large permanent population, the research 
                      stations host scientists from countries with diverse scripts and languages, 
                      making Universal Acceptance important for their communication networks.
                    </p>
                    
                    <p className="text-gray-600">
                      Just as Antarctica is a shared international territory, the internet is a shared 
                      global resource that should be accessible to everyone, regardless of the language 
                      they speak or the script they use. Universal Acceptance is the key to unlocking 
                      this global potential.
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

// World regions data
const worldRegions: Omit<Region, 'unlockedAt'>[] = [
  {
    id: "region1",
    name: "East Asia",
    population: "1.7 billion",
    languages: ["Chinese", "Japanese", "Korean"],
    script: "CJK Scripts",
    benefits: [
      "Access to the world's largest market",
      "Support for complex ideographic characters",
      "Integration with major e-commerce platforms"
    ],
    icon: <EastAsiaIcon className="h-6 w-6" />
  },
  {
    id: "region2",
    name: "South Asia",
    population: "1.9 billion",
    languages: ["Hindi", "Bengali", "Tamil", "Urdu"],
    script: "Indic Scripts",
    benefits: [
      "Reach rapidly growing digital markets",
      "Support for diverse Indic scripts",
      "Enable digital inclusion for rural populations"
    ],
    icon: <SouthAsiaIcon className="h-6 w-6" />
  },
  {
    id: "region3",
    name: "Middle East",
    population: "450 million",
    languages: ["Arabic", "Persian", "Hebrew"],
    script: "RTL Scripts",
    benefits: [
      "Access to oil-rich economies",
      "Support for right-to-left text direction",
      "Enable commerce in growing technology markets"
    ],
    icon: <MiddleEastIcon className="h-6 w-6" />
  },
  {
    id: "region4",
    name: "Eastern Europe",
    population: "290 million",
    languages: ["Russian", "Ukrainian", "Bulgarian"],
    script: "Cyrillic Script",
    benefits: [
      "Access to emerging digital economies",
      "Support for Cyrillic characters",
      "Integration with regional platforms"
    ],
    icon: <EasternEuropeIcon className="h-6 w-6" />
  },
  {
    id: "region5",
    name: "Southeast Asia",
    population: "670 million",
    languages: ["Thai", "Vietnamese", "Indonesian"],
    script: "Southeast Asian Scripts",
    benefits: [
      "Access to fast-growing mobile markets",
      "Support for Thai, Lao, and other scripts",
      "Enable e-commerce in developing economies"
    ],
    icon: <SoutheastAsiaIcon className="h-6 w-6" />
  },
  {
    id: "region6",
    name: "Africa",
    population: "1.3 billion",
    languages: ["Amharic", "Swahili", "Arabic"],
    script: "African Scripts",
    benefits: [
      "Reach the world's youngest population",
      "Support for Ethiopic and other African scripts",
      "Enable digital inclusion in emerging markets"
    ],
    icon: <AfricaIcon className="h-6 w-6" />
  }
].map(region => ({ ...region, unlockedAt: null }));

// Icon components
function CheckIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

// Region icons
function EastAsiaIcon(props: any) {
  return <Building {...props} />;
}

function SouthAsiaIcon(props: any) {
  return <Users {...props} />;
}

function MiddleEastIcon(props: any) {
  return <Briefcase {...props} />;
}

function EasternEuropeIcon(props: any) {
  return <Building {...props} />;
}

function SoutheastAsiaIcon(props: any) {
  return <Users {...props} />;
}

function AfricaIcon(props: any) {
  return <GraduationCap {...props} />;
}

export default Level7Page;