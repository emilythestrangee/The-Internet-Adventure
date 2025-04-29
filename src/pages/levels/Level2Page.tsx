import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Globe, Mail } from 'lucide-react';
import VideoPlayer from '../../components/VideoPlayer';
import QuizModule from '../../components/QuizModule';
import CountryTheme from '../../components/CountryTheme';
import { useGameStore, canAccessLevel } from '../../store/gameStore';

const Level2Page: React.FC = () => {
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
  const [country, setCountry] = useState<string>('Bahrain');
  const levelId = 2;
  const level = levels.find(l => l.id === levelId);
  const isLevelCompleted = level?.completed || false;
  
  useEffect(() => {
    // Check if user can access this level
    if (!canAccessLevel(levelId)) {
      navigate('/');
      return;
    }
    
    setCurrentLevel(levelId);
    return () => setCurrentLevel(null);
  }, [navigate, setCurrentLevel]);

  const handleLevelComplete = () => {
    completeCountry(levelId, country);
    
    // If both countries are completed, unlock the next level
    if (
      (country === 'Bahrain' && level?.countries['India']?.completed) ||
      (country === 'India' && level?.countries['Bahrain']?.completed)
    ) {
      completeLevel(levelId);
      unlockBadge('asia-badge');
      earnXP(150);
      setShowSuccess(true);
    } else {
      // Switch to the other country
      setCountry(country === 'Bahrain' ? 'India' : 'Bahrain');
      earnXP(75);
    }
  };

  const handleContinue = () => {
    navigate('/level/3');
  };

  // Quiz questions for Bahrain
  const bahrainQuestions = [
    {
      id: 1,
      question: "What is Email Address Internationalization (EAI)?",
      options: [
        "Using different country domains for email",
        "Allowing non-ASCII characters in email addresses",
        "Sending emails in multiple languages",
        "Limiting email addresses to 20 characters"
      ],
      correctAnswer: 1,
      explanation: "EAI allows email addresses to use non-ASCII characters, enabling addresses in Arabic, Chinese, and other scripts."
    },
    {
      id: 2,
      question: "A Bahraini company's email system rejects addresses like محمد@شركة.البحرين. What's the issue?",
      options: [
        "The domain is invalid",
        "Their email server doesn't support Unicode",
        "Arabic script is not allowed in emails",
        "The address is too long"
      ],
      correctAnswer: 1,
      explanation: "The email server likely doesn't support Unicode or EAI (Email Address Internationalization), which is needed for Arabic addresses."
    },
    {
      id: 3,
      question: "What standards should email systems follow to support internationalized addresses?",
      options: [
        "ASCII-only validation",
        "SMTP extensions like SMTPUTF8 and UTF8SMTP",
        "Restricting addresses to Latin characters",
        "Limiting domain names to country codes"
      ],
      correctAnswer: 1,
      explanation: "SMTP extensions like SMTPUTF8 allow email systems to handle internationalized email addresses."
    },
    {
      id: 4,
      question: "In Bahrain, a government agency wants to use Arabic email addresses. What's needed?",
      options: [
        "Special permission from ICANN",
        "Updates to mail servers, clients, and forms to support Arabic script",
        "Use of only certain approved Arabic characters",
        "Transliteration to Latin script"
      ],
      correctAnswer: 1,
      explanation: "They need comprehensive updates to their email infrastructure to handle Arabic characters throughout the email system."
    },
    {
      id: 5,
      question: "What's a key challenge for EAI in Bahrain?",
      options: [
        "Limited internet access",
        "Too many dialects of Arabic",
        "Ensuring older systems can interoperate with internationalized addresses",
        "The high cost of Arabic keyboards"
      ],
      correctAnswer: 2,
      explanation: "Legacy systems that can't handle Unicode often create interoperability issues when implementing EAI."
    }
  ];

  // Quiz questions for India
  const indiaQuestions = [
    {
      id: 1,
      question: "Why is EAI important in India?",
      options: [
        "India has no national language",
        "India uses over 22 official languages with unique scripts",
        "Indians don't use email much",
        "India's domain names are very expensive"
      ],
      correctAnswer: 1,
      explanation: "India's linguistic diversity with 22 officially recognized languages makes EAI crucial for digital inclusion."
    },
    {
      id: 2,
      question: "An Indian university can't set up student emails in Devanagari script. Why?",
      options: [
        "Devanagari is not a valid script for the internet",
        "Their email system doesn't support non-ASCII characters",
        "Students wouldn't understand how to use them",
        "Email providers block Devanagari"
      ],
      correctAnswer: 1,
      explanation: "Their email system likely lacks Unicode and SMTPUTF8 support, preventing the use of Devanagari script."
    },
    {
      id: 3,
      question: "Which of these is a valid internationalized email address?",
      options: [
        "राहुल@विद्यालय.भारत",
        "rahul@@vidyalaya.bharat",
        "राहुल@vidyalaya.in",
        "rahul@विद्यालय..भारत"
      ],
      correctAnswer: 0,
      explanation: "राहुल@विद्यालय.भारत is a valid email address with both the local part and domain in Devanagari script."
    },
    {
      id: 4,
      question: "What is punycode in the context of email addresses?",
      options: [
        "A way to make emails more secure",
        "A programming language for email servers",
        "An encoding that converts IDNs to ASCII for compatibility",
        "A method to compress email data"
      ],
      correctAnswer: 2,
      explanation: "Punycode converts internationalized domain names (IDNs) to ASCII for systems that don't support Unicode directly."
    },
    {
      id: 5,
      question: "What approach would best help an Indian government service be more UA-ready?",
      options: [
        "Requiring all citizens to use English",
        "Supporting both Latin and Indian script email addresses and domain names",
        "Using only numerical IDs instead of names",
        "Limiting services to in-person only"
      ],
      correctAnswer: 1,
      explanation: "Supporting both Latin and indigenous scripts ensures digital inclusion for all citizens regardless of their preferred language."
    }
  ];

  // Select questions based on current country
  const questions = country === 'Bahrain' ? bahrainQuestions : indiaQuestions;
  const countryState = level?.countries[country];
  const isCountryCompleted = countryState?.completed || false;

  return (
    <CountryTheme countryName={country}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={country}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                <h1 className="text-2xl font-bold">Level 2: Asia - Email Revolution</h1>
                <p className="mt-2">Your mission takes you to {country}, where you'll help implement email address internationalization.</p>
              </div>
              
              {!isLevelCompleted ? (
                <div className="p-6">
                  {/* Country Selection Tabs if not completed yet */}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        country === 'Bahrain' 
                          ? 'border-b-2 border-primary-500 text-primary-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => !isCountryCompleted && setCountry('Bahrain')}
                    >
                      Bahrain
                      {level?.countries['Bahrain']?.completed && ' ✓'}
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        country === 'India' 
                          ? 'border-b-2 border-primary-500 text-primary-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => !isCountryCompleted && setCountry('India')}
                    >
                      India
                      {level?.countries['India']?.completed && ' ✓'}
                    </button>
                  </div>
                  
                  {!isCountryCompleted ? (
                    <>
                      <div className="mb-8">
                        <VideoPlayer 
                          videoPlaceholder={true}
                          title={`Welcome to ${country}!`}
                          description={`Your NPC guide will introduce you to the challenges of Email Address Internationalization in ${country}.`}
                          countryName={country}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                          Mission Background: {country}
                        </h2>
                        {country === 'Bahrain' ? (
                          <p className="text-gray-600 mb-4">
                            In Bahrain, businesses and government agencies are working to provide digital services 
                            in Arabic. However, many email systems reject Arabic email addresses, creating barriers
                            for users who prefer to communicate in their native language.
                          </p>
                        ) : (
                          <p className="text-gray-600 mb-4">
                            India's linguistic diversity presents unique challenges for digital inclusion. 
                            With 22 officially recognized languages, many with their own scripts, supporting 
                            email addresses in local languages is essential for reaching all citizens.
                          </p>
                        )}
                      </div>
                      
                      <QuizModule 
                        title={`${country} EAI Challenge`}
                        description={`Complete this quiz to demonstrate your understanding of Email Address Internationalization in ${country}.`}
                        questions={questions}
                        onComplete={handleLevelComplete}
                      />
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {country} Challenge Completed!
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        You've successfully completed the {country} challenge. Please select the other country to continue.
                      </p>
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
                    Congratulations! You've helped organizations in Bahrain and India 
                    implement Email Address Internationalization.
                  </p>
                  
                  <div className="inline-block badge badge-success mb-6">
                    +150 XP Earned
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      className="btn btn-primary"
                      onClick={handleContinue}
                    >
                      Continue to Europe
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
                  Asia UA Ambassador Badge Earned!
                </h3>
                
                <p className="text-green-700 mb-4">
                  You've successfully helped organizations in Bahrain and India implement Email Address Internationalization.
                  Level 3 has been unlocked!
                </p>
                
                <button
                  className="btn btn-primary"
                  onClick={handleContinue}
                >
                  Continue to Europe
                </button>
              </motion.div>
            )}
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About {country} and Email Internationalization
                </h2>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                      <Mail className="h-12 w-12 text-primary-600" />
                    </div>
                  </div>
                  
                  <div>
                    {country === 'Bahrain' ? (
                      <>
                        <p className="text-gray-600 mb-4">
                          Bahrain is a small, technologically advanced island nation in the Persian Gulf, 
                          with Arabic as its official language. As the country continues its digital transformation,
                          providing services in Arabic is a key priority.
                        </p>
                        
                        <p className="text-gray-600 mb-4">
                          The .البحرين (Bahrain) top-level domain allows websites to use Arabic script, 
                          but email addresses in Arabic remain challenging due to limited support in many email systems.
                        </p>
                        
                        <p className="text-gray-600">
                          Implementing Email Address Internationalization (EAI) helps Bahrain's citizens 
                          engage with digital services in their native language, increasing accessibility 
                          and digital inclusion.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 mb-4">
                          India has an incredibly diverse linguistic landscape with 22 officially recognized languages, 
                          many with their own unique scripts. This diversity presents both challenges and opportunities 
                          for digital communication.
                        </p>
                        
                        <p className="text-gray-600 mb-4">
                          The .भारत (India) top-level domain in Devanagari script, along with other IDNs in various Indian scripts, 
                          allows for more inclusive web addresses, but email addresses in local scripts face adoption barriers.
                        </p>
                        
                        <p className="text-gray-600">
                          By implementing EAI, Indian organizations can better serve their diverse population, 
                          particularly those more comfortable using their regional languages like Hindi, Tamil, 
                          Telugu, Bengali, and others.
                        </p>
                      </>
                    )}
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

// Helper component for the check mark
const Check: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default Level2Page;