
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Award, ArrowRight } from 'lucide-react';
import AvatarSelect from '../components/AvatarSelect';
import LevelCard from '../components/LevelCard';
import { useGameStore, type Avatar } from '../store/gameStore';
import ToolsSection from '../components/ToolsSection';
import LinkFinder from '../components/LinkFinder';
import '../style.css';
import Email from '../components/Email';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    initialized,
    setPlayerName, 
    setAvatar, 
    initializeGame,
  } = useGameStore();
  
  const [name, setName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [nameError, setNameError] = useState<string>('');
  const [avatarError, setAvatarError] = useState<string>('');
  const [setupComplete, setSetupComplete] = useState<boolean>(initialized);
  
  useEffect(() => {
    setSetupComplete(initialized);
  }, [initialized]);
  
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    if (nameError) setNameError('');
  };
  
  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    if (avatarError) setAvatarError('');
  };
  
  const handleStartGame = () => {
    if (!name.trim()) {
      setNameError('Please enter your name');
      return;
    }
    
    if (!selectedAvatar) {
      setAvatarError('Please select an avatar');
      return;
    }
    
    setPlayerName(name);
    setAvatar(selectedAvatar);
    initializeGame();
    setSetupComplete(true);
  };
  
  const handleStartAdventure = () => {
    navigate('/level/1');
  };
  
  const globeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.8, delay: 0.2 }
    }
  };
  
  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, delay: 0.3 + (custom * 0.1) }
    })
  };
  
  const levelData = [
    {
      id: 1,
      title: "Level 1: The Universal Challenge",
      description: "Begin your journey in Egypt, where internationalized domain names are causing issues for local businesses.",
      countries: ["Egypt"],
      continent: "Africa"
    },
    {
      id: 2,
      title: "Level 2: Email Revolution",
      description: "Travel to Asia and help implement email address internationalization in Bahrain and India.",
      countries: ["Bahrain", "India"],
      continent: "Asia"
    },
    {
      id: 3,
      title: "Level 3: European Standards",
      description: "Visit Germany to help update systems for proper Unicode support.",
      countries: ["Germany"],
      continent: "Europe"
    },
    {
      id: 4,
      title: "Level 4: North American Integration",
      description: "Assist Mexico in implementing proper validation for multilingual domain names.",
      countries: ["Mexico"],
      continent: "North America"
    },
    {
      id: 5,
      title: "Level 5: South American Solutions",
      description: "Fix email validation issues in Brazil to support local languages.",
      countries: ["Brazil"],
      continent: "South America"
    },
    {
      id: 6,
      title: "Level 6: Down Under Development",
      description: "Improve email server configurations in Australia for better international support.",
      countries: ["Australia"],
      continent: "Australia"
    },
    {
      id: 7,
      title: "Level 7: Antarctic Achievement",
      description: "Make the international research stations UA compliant at the end of the world.",
      countries: ["Research Station"],
      continent: "Antarctica"
    }
  ];
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
      {!setupComplete ? (
        <div className="max-w-xl mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-800 to-indigo-900 p-6 text-white">
            <h1 className="text-2xl font-bold">Welcome to The Internet Adventure</h1>
            <p className="mt-2">Before you begin your journey, let's get to know you</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
                  nameError ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your name"
                value={name}
                onChange={handleNameChange}
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-500">{nameError}</p>
              )}
            </div>
            
            <div className="mb-6">
              <AvatarSelect 
                selectedAvatar={selectedAvatar} 
                onSelect={handleAvatarSelect} 
              />
              {avatarError && (
                <p className="mt-1 text-sm text-red-500 text-center">{avatarError}</p>
              )}
            </div>
            
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              onClick={handleStartGame}
            >
              Start Your Adventure
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textVariants}
              custom={0}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                The Internet Adventure
              </h1>
              <motion.p 
                className="text-xl text-gray-400 mb-6"
                variants={textVariants}
                custom={1}
              >
                Become a Universal Acceptance Ambassador and help make the internet accessible to everyone in their own language!
              </motion.p>
              <motion.div
                variants={textVariants}
                custom={2}
              >
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center py-2 px-4 rounded-lg"
                  onClick={handleStartAdventure}
                >
                  <span>Start Adventure</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="flex justify-center"
              variants={globeVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="w-full h-full text-blue-500 globe-rotate" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-1/4 h-1/4 text-yellow-500" />
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Your Adventure Map</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levelData.map((level) => (
                <LevelCard
                  key={level.id}
                  levelId={level.id}
                  title={level.title}
                  description={level.description}
                  countries={level.countries}
                  continent={level.continent}
                />
              ))}
            </div>
          </div>

          {/* Move ToolsSection and LinkFinder inside setupComplete true block */}
          <LinkFinder />
          <ToolsSection />
          <Email />
        </div>
      )}
    </div>
  );
};

export default HomePage;
