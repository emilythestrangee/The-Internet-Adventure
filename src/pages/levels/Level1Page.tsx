import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Globe } from 'lucide-react';
import VideoPlayer from '../../components/VideoPlayer';
import QuizModule from '../../components/QuizModule';
import CountryTheme from '../../components/CountryTheme';
import { useGameStore } from '../../store/gameStore';

const Level1Page: React.FC = () => {
  const navigate = useNavigate();
  const { 
    completeLevel, 
    unlockBadge, 
    earnXP,
    completeCountry,
    setCurrentLevel,
    currentLevel,
    levels
  } = useGameStore();
  
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const levelId = 1;
  const country = 'Egypt';
  const level = levels.find(l => l.id === levelId);
  const isCompleted = level?.completed || false;
  
  useEffect(() => {
    setCurrentLevel(levelId);
    return () => setCurrentLevel(null);
  }, [setCurrentLevel]);

  const handleLevelComplete = () => {
    completeCountry(levelId, country);
    completeLevel(levelId);
    unlockBadge('africa-badge');
    earnXP(100);
    setShowSuccess(true);
  };

  const handleContinue = () => {
    navigate('/level/2');
  };

  // Quiz questions
  const questions = [
    {
      id: 1,
      question: "What is the main goal of Universal Acceptance?",
      options: [
        "To limit domain names to English only",
        "To ensure all domain names work in all applications regardless of script",
        "To prevent domain name fraud",
        "To make domain names shorter"
      ],
      correctAnswer: 1,
      explanation: "Universal Acceptance ensures that all domain names and email addresses work in all applications, regardless of script, language or character length."
    },
    {
      id: 2,
      question: "A website can't process the domain مثال.مصر. What's the likely issue?",
      options: [
        "The domain is invalid",
        "The domain uses Arabic script which the website doesn't support",
        "The domain is too expensive",
        "The domain is restricted"
      ],
      correctAnswer: 1,
      explanation: "The website likely doesn't support Internationalized Domain Names (IDNs) in Arabic script. This is a common UA issue."
    },
    {
      id: 3,
      question: "Which of these is a valid domain name?",
      options: [
        "example..com",
        "例子.公司",
        "http://example",
        "www.exa mple.com"
      ],
      correctAnswer: 1,
      explanation: "例子.公司 is a valid IDN. Spaces are not allowed in domain names, and domains must follow specific syntax rules."
    },
    {
      id: 4,
      question: "In Egypt, a government website can't launch with a .مصر domain. What's likely needed?",
      options: [
        "More funding",
        "A different domain name",
        "Updates to their web servers and applications to support Arabic script",
        "Permission from ICANN"
      ],
      correctAnswer: 2,
      explanation: "Their web systems likely need to be updated to handle Arabic script in domain names, which is a key aspect of Universal Acceptance."
    },
    {
      id: 5,
      question: "What would make an Egyptian business website more UA-ready?",
      options: [
        "Using only English domain names",
        "Supporting both Arabic and Latin script domain names",
        "Blocking all international domains",
        "Using IP addresses instead of domain names"
      ],
      correctAnswer: 1,
      explanation: "Supporting multiple scripts, including Arabic and Latin, would make the website more universally accessible to all users."
    }
  ];

  return (
    <CountryTheme countryName={country}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                <h1 className="text-2xl font-bold">Level 1: Africa - The Universal Challenge</h1>
                <p className="mt-2">Your first mission takes you to Egypt, where local businesses are facing challenges with internationalized domain names.</p>
              </div>
              
              {!isCompleted ? (
                <div className="p-6">
                  <div className="mb-8">
                    <VideoPlayer 
                      videoPlaceholder={true}
                      title="Welcome to Egypt!"
                      description="Your NPC guide will introduce you to the challenges of Universal Acceptance in Egypt."
                      countryName={country}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Mission Background
                    </h2>
                    <p className="text-gray-300 mb-4">
                      In Egypt, many businesses are struggling to establish their online presence using Arabic script domain names. 
                      A local web development firm has hired you to help solve Universal Acceptance issues affecting their clients.
                    </p>
                    <p className="text-gray-300 mb-4">
                      Your first task is to demonstrate your knowledge of internationalized domain names (IDNs) 
                      and how they affect Egyptian businesses trying to serve their local communities online.
                    </p>
                  </div>
                  
                  <QuizModule 
                    title="Universal Acceptance Challenge"
                    description="Complete this quiz to demonstrate your understanding of IDNs and Universal Acceptance in Egypt."
                    questions={questions}
                    onComplete={handleLevelComplete}
                  />
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                    <Award className="h-16 w-16 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Level Completed!
                  </h2>
                  
                  <p className="text-lg text-gray-300 mb-6">
                    Congratulations! You've helped businesses in Egypt understand and implement 
                    Universal Acceptance for Arabic domain names.
                  </p>
                  
                  <div className="inline-block badge badge-success mb-6">
                    +100 XP Earned
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      className="btn btn-primary"
                      onClick={handleContinue}
                    >
                      Continue to Asia
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
                  Africa UA Ambassador Badge Earned!
                </h3>
                
                <p className="text-green-700 mb-4">
                  You've successfully helped Egyptian businesses implement Universal Acceptance.
                  Level 2 has been unlocked!
                </p>
                
                <button
                  className="btn btn-primary"
                  onClick={handleContinue}
                >
                  Continue to Asia
                </button>
              </motion.div>
            )}
            
            <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  About Egypt and Universal Acceptance
                </h2>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                      <Globe className="h-12 w-12 text-primary-600" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-300 mb-4">
                      Egypt has been at the forefront of pushing for Arabic script usage on the internet. 
                      The country operates the .مصر (.egypt) country code top-level domain, allowing 
                      websites to have fully Arabic addresses.
                    </p>
                    
                    <p className="text-gray-300 mb-4">
                      However, many applications and services still don't properly support these 
                      internationalized domain names, creating barriers for Egyptian businesses 
                      and users who prefer to operate in Arabic.
                    </p>
                    
                    <p className="text-gray-300">
                      By implementing Universal Acceptance, Egyptian websites and online services 
                      can better serve their local communities while maintaining global connectivity.
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

export default Level1Page;
