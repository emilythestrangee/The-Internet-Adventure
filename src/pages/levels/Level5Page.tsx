import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, BookOpen, FileText, Code, Globe, Mail, GraduationCap } from 'lucide-react';
import Confetti from 'react-confetti';
import VideoPlayer from '../../components/VideoPlayer';
import CountryTheme from '../../components/CountryTheme';
import { useGameStore, canAccessLevel } from '../../store/gameStore';

// Curriculum Designer game types
interface CurriculumTopic {
  id: string;
  title: string;
  type: 'theory' | 'practical';
  description: string;
  icon: React.ReactNode;
  category: 'idn' | 'eai' | 'ua' | 'storage' | 'testing';
  difficulty: 1 | 2 | 3; // 1 = easy, 2 = medium, 3 = advanced
}

const Level5Page: React.FC = () => {
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
  
  const [availableTopics, setAvailableTopics] = useState<CurriculumTopic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<CurriculumTopic[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  
  const levelId = 5;
  const country = 'Brazil';
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
      setAvailableTopics([...curriculumTopics]);
      setSelectedTopics([]);
      setScore(0);
    }
  }, [isCompleted, gameCompleted]);
  
  const handleTopicSelect = (topic: CurriculumTopic) => {
    // Move from available to selected
    setAvailableTopics(prev => prev.filter(t => t.id !== topic.id));
    setSelectedTopics(prev => [...prev, topic]);
  };
  
  const handleTopicRemove = (topic: CurriculumTopic) => {
    // Move from selected back to available
    setSelectedTopics(prev => prev.filter(t => t.id !== topic.id));
    setAvailableTopics(prev => [...prev, topic]);
  };
  
  const handleSubmitCurriculum = () => {
    // Evaluate curriculum quality
    // Good curriculum has balance between theory and practical, covers all categories, and has appropriate difficulty progression
    
    let curriculumScore = 0;
    const maxScore = 100;
    
    // Check if we have at least 6 topics
    if (selectedTopics.length >= 6) {
      curriculumScore += 20;
    } else if (selectedTopics.length >= 4) {
      curriculumScore += 10;
    }
    
    // Check theory/practical balance (ideally close to 50/50)
    const theoryCount = selectedTopics.filter(t => t.type === 'theory').length;
    const practicalCount = selectedTopics.filter(t => t.type === 'practical').length;
    const balance = Math.min(theoryCount, practicalCount) / Math.max(theoryCount, practicalCount);
    
    if (balance >= 0.8) { // Very balanced (at least 80% ratio)
      curriculumScore += 20;
    } else if (balance >= 0.5) { // Somewhat balanced
      curriculumScore += 10;
    }
    
    // Check category coverage
    const categories = new Set(selectedTopics.map(t => t.category));
    curriculumScore += categories.size * 5; // 5 points per category covered
    
    // Check difficulty progression
    const hasEasy = selectedTopics.some(t => t.difficulty === 1);
    const hasMedium = selectedTopics.some(t => t.difficulty === 2);
    const hasAdvanced = selectedTopics.some(t => t.difficulty === 3);
    
    if (hasEasy && hasMedium && hasAdvanced) {
      curriculumScore += 15; // Good progression
    } else if ((hasEasy && hasMedium) || (hasMedium && hasAdvanced)) {
      curriculumScore += 10; // Partial progression
    }
    
    // Check if specific key topics are included
    const mustHaveTopics = ['idn-intro', 'eai-validation', 'unicode-storage'];
    const includedKeyTopics = mustHaveTopics.filter(topicId => 
      selectedTopics.some(t => t.id === topicId)
    );
    
    curriculumScore += includedKeyTopics.length * 5; // 5 points per key topic
    
    // Cap at max score
    curriculumScore = Math.min(curriculumScore, maxScore);
    
    setScore(curriculumScore);
    
    // Feedback based on score
    if (curriculumScore >= 70) {
      setFeedback("Excellent curriculum! It covers a good balance of theory and practice, with appropriate progression through difficulty levels.");
    } else if (curriculumScore >= 50) {
      setFeedback("Good curriculum, but it could be improved with better balance or broader coverage of topics.");
    } else {
      setFeedback("This curriculum needs significant improvement. Consider balancing theory and practice, covering more categories, and including topics of varying difficulty.");
    }
    
    setGameCompleted(true);
    setShowConfetti(curriculumScore >= 70);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };
  
  const handleLevelComplete = () => {
    completeCountry(levelId, country);
    completeLevel(levelId);
    unlockBadge('south-america-badge');
    earnXP(150);
    setShowSuccess(true);
  };
  
  const handleContinue = () => {
    navigate('/level/6');
  };
  
  // Group available topics by category
  const groupedTopics: Record<string, CurriculumTopic[]> = {};
  availableTopics.forEach(topic => {
    if (!groupedTopics[topic.category]) {
      groupedTopics[topic.category] = [];
    }
    groupedTopics[topic.category].push(topic);
  });
  
  // Check if curriculum can be submitted
  const canSubmit = selectedTopics.length >= 4;
  
  // Check if player passed
  const isPassing = score >= 70;
  
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
                <h1 className="text-2xl font-bold">Level 5: South America - Curriculum Designer</h1>
                <p className="mt-2">Your mission takes you to Brazil, where you'll create a curriculum to teach Universal Acceptance.</p>
              </div>
              
              {!isCompleted ? (
                <div className="p-6">
                  <div className="mb-8">
                    <VideoPlayer 
                      videoPlaceholder={true}
                      title="Welcome to Brazil!"
                      description="Your NPC guide will explain your mission to create an educational curriculum on Universal Acceptance."
                      countryName={country}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Mission Background
                    </h2>
                    <p className="text-gray-600 mb-4">
                      In Brazil, a major university wants to integrate Universal Acceptance into its 
                      computer science curriculum. They've asked you to design a balanced curriculum that 
                      covers the key aspects of UA, with both theory and practical components.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Your task is to select topics that form a comprehensive curriculum to teach 
                      students about Universal Acceptance, internationalized domain names, and 
                      email address internationalization.
                    </p>
                  </div>
                  
                  {!gameCompleted ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="font-medium text-gray-900">Available Topics</h3>
                          <p className="text-sm text-gray-600">Drag topics to build your curriculum:</p>
                        </div>
                        
                        <div className="p-4 h-[500px] overflow-y-auto">
                          {Object.keys(groupedTopics).length > 0 ? (
                            <div className="space-y-6">
                              {Object.entries(groupedTopics).map(([category, topics]) => (
                                <div key={category}>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                                    {getCategoryName(category)}
                                  </h4>
                                  
                                  <div className="space-y-2">
                                    {topics.map(topic => (
                                      <motion.div
                                        key={topic.id}
                                        className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => handleTopicSelect(topic)}
                                      >
                                        <div className="flex items-start">
                                          <div className="flex-shrink-0 mt-1">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                              topic.type === 'theory' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                              {topic.icon}
                                            </div>
                                          </div>
                                          <div className="ml-3 flex-1">
                                            <div className="flex justify-between">
                                              <p className="text-sm font-medium text-gray-900">{topic.title}</p>
                                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                topic.type === 'theory' 
                                                  ? 'bg-blue-100 text-blue-800' 
                                                  : 'bg-green-100 text-green-800'
                                              }`}>
                                                {topic.type}
                                              </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{topic.description}</p>
                                            <div className="mt-1 flex items-center">
                                              <div className="flex">
                                                {Array(topic.difficulty).fill(0).map((_, i) => (
                                                  <Star 
                                                    key={i} 
                                                    className="h-3 w-3 text-amber-500" 
                                                    fill="currentColor"
                                                  />
                                                ))}
                                                {Array(3 - topic.difficulty).fill(0).map((_, i) => (
                                                  <Star 
                                                    key={i} 
                                                    className="h-3 w-3 text-gray-300" 
                                                  />
                                                ))}
                                              </div>
                                              <span className="text-xs text-gray-500 ml-1">
                                                {topic.difficulty === 1 ? 'Basic' : topic.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No more available topics
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-900">Your Curriculum</h3>
                              <p className="text-xs text-gray-600">{selectedTopics.length} topics selected</p>
                            </div>
                            
                            <button
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                canSubmit 
                                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                              onClick={handleSubmitCurriculum}
                              disabled={!canSubmit}
                            >
                              Submit
                            </button>
                          </div>
                          
                          <div className="p-4 h-[400px] overflow-y-auto">
                            {selectedTopics.length > 0 ? (
                              <div className="space-y-2">
                                {selectedTopics.map((topic, index) => (
                                  <motion.div
                                    key={topic.id}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-start">
                                        <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                                          topic.type === 'theory' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                          {topic.icon}
                                        </div>
                                        <div className="ml-2">
                                          <p className="text-sm font-medium text-gray-900">{topic.title}</p>
                                          <div className="flex items-center mt-1">
                                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                              topic.type === 'theory' 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                              {topic.type}
                                            </span>
                                            <span className="mx-1 text-xs text-gray-400">•</span>
                                            <div className="flex">
                                              {Array(topic.difficulty).fill(0).map((_, i) => (
                                                <Star 
                                                  key={i} 
                                                  className="h-3 w-3 text-amber-500" 
                                                  fill="currentColor"
                                                />
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <button
                                        className="text-gray-400 hover:text-gray-600"
                                        onClick={() => handleTopicRemove(topic)}
                                      >
                                        <XIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                                <BookOpen className="h-8 w-8 text-gray-300 mb-2" />
                                <p>Your curriculum is empty</p>
                                <p className="text-sm text-gray-400 mt-1">Select topics from the left panel</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Tips for a Good Curriculum:</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                  <CheckIcon className="h-3 w-3 text-green-500" />
                                </div>
                                <span className="ml-1.5">Balance theory and practical topics</span>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                  <CheckIcon className="h-3 w-3 text-green-500" />
                                </div>
                                <span className="ml-1.5">Cover IDNs, EAI, and storage topics</span>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                  <CheckIcon className="h-3 w-3 text-green-500" />
                                </div>
                                <span className="ml-1.5">Include topics with varying difficulty levels</span>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                  <CheckIcon className="h-3 w-3 text-green-500" />
                                </div>
                                <span className="ml-1.5">Select at least 6 topics for a comprehensive curriculum</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-block p-4 rounded-full mb-6 bg-primary-100">
                        {isPassing ? (
                          <GraduationCap className="h-16 w-16 text-primary-600" />
                        ) : (
                          <BookOpen className="h-16 w-16 text-amber-600" />
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Curriculum Evaluation
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
                              strokeDashoffset={Math.ceil(2 * Math.PI * 40 * (1 - score / 100))}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                          </svg>
                          <span className="absolute text-2xl font-bold">{score}%</span>
                        </div>
                      </div>
                      
                      <p className="text-lg font-medium text-gray-800 mb-4">
                        {isPassing 
                          ? "Excellent Curriculum Design!" 
                          : "Your Curriculum Needs Improvement"}
                      </p>
                      
                      {feedback && (
                        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                          {feedback}
                        </p>
                      )}
                      
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
                            You need at least 70% score to pass.
                          </p>
                          <button
                            className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => {
                              setAvailableTopics([...curriculumTopics]);
                              setSelectedTopics([]);
                              setGameCompleted(false);
                              setScore(0);
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
                    Congratulations! You've created an excellent curriculum for teaching 
                    Universal Acceptance at the Brazilian university.
                  </p>
                  
                  <div className="inline-block badge badge-success mb-6">
                    +150 XP Earned
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      className="btn btn-primary"
                      onClick={handleContinue}
                    >
                      Continue to Australia
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
                  South America UA Ambassador Badge Earned!
                </h3>
                
                <p className="text-green-700 mb-4">
                  You've successfully created a curriculum to teach Universal Acceptance in Brazil.
                  Level 6 has been unlocked!
                </p>
                
                <button
                  className="btn btn-primary"
                  onClick={handleContinue}
                >
                  Continue to Australia
                </button>
              </motion.div>
            )}
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About Brazil and Universal Acceptance
                </h2>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                      <Globe className="h-12 w-12 text-primary-600" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-4">
                      Brazil is the largest country in South America and has Portuguese as its official language. 
                      With a population of over 210 million, Brazil represents a significant portion of the 
                      world's internet users.
                    </p>
                    
                    <p className="text-gray-600 mb-4">
                      The .br TLD serves Brazil, but supporting Portuguese characters (like ã, é, ç) 
                      is important for truly inclusive digital services. Additionally, Brazil has many 
                      indigenous languages that benefit from internationalized domain names.
                    </p>
                    
                    <p className="text-gray-600">
                      As a regional technology leader, Brazilian universities play a crucial role in 
                      training the next generation of developers who will implement Universal Acceptance. 
                      By integrating UA principles into computer science curricula, Brazil can lead the 
                      way in creating a more inclusive internet for all.
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

// Curriculum topics data
const curriculumTopics: CurriculumTopic[] = [
  {
    id: "idn-intro",
    title: "Introduction to IDNs",
    type: "theory",
    description: "Overview of Internationalized Domain Names and their importance",
    icon: <Globe className="h-4 w-4" />,
    category: "idn",
    difficulty: 1
  },
  {
    id: "idn-history",
    title: "History of Domain Names",
    type: "theory",
    description: "Evolution from ASCII-only to internationalized domains",
    icon: <FileText className="h-4 w-4" />,
    category: "idn",
    difficulty: 1
  },
  {
    id: "idn-technical",
    title: "Technical Standards for IDNs",
    type: "theory",
    description: "IDNA protocols, Punycode, and Unicode integration",
    icon: <FileText className="h-4 w-4" />,
    category: "idn",
    difficulty: 3
  },
  {
    id: "idn-lab",
    title: "IDN Implementation Lab",
    type: "practical",
    description: "Hands-on exercises for implementing IDN support in applications",
    icon: <Code className="h-4 w-4" />,
    category: "idn",
    difficulty: 2
  },
  {
    id: "eai-intro",
    title: "Email Address Internationalization",
    type: "theory",
    description: "Fundamentals of internationalized email addresses",
    icon: <Mail className="h-4 w-4" />,
    category: "eai",
    difficulty: 1
  },
  {
    id: "eai-protocols",
    title: "EAI Protocols & Standards",
    type: "theory",
    description: "SMTPUTF8, UTF8SMTP, and email delivery protocols",
    icon: <FileText className="h-4 w-4" />,
    category: "eai",
    difficulty: 3
  },
  {
    id: "eai-validation",
    title: "Email Validation Workshop",
    type: "practical",
    description: "Building robust validation for international email addresses",
    icon: <Code className="h-4 w-4" />,
    category: "eai",
    difficulty: 2
  },
  {
    id: "eai-testing",
    title: "EAI Testing Frameworks",
    type: "practical",
    description: "Methods to test email systems for internationalization",
    icon: <Code className="h-4 w-4" />,
    category: "eai",
    difficulty: 2
  },
  {
    id: "ua-principles",
    title: "UA Principles & Best Practices",
    type: "theory",
    description: "Core principles of Universal Acceptance implementation",
    icon: <BookOpen className="h-4 w-4" />,
    category: "ua",
    difficulty: 1
  },
  {
    id: "ua-business",
    title: "Business Case for UA",
    type: "theory",
    description: "Economic and social benefits of Universal Acceptance",
    icon: <Briefcase className="h-4 w-4" />,
    category: "ua",
    difficulty: 1
  },
  {
    id: "ua-audit",
    title: "UA Readiness Audit Workshop",
    type: "practical",
    description: "Techniques to evaluate and improve UA readiness",
    icon: <CheckList className="h-4 w-4" />,
    category: "ua",
    difficulty: 2
  },
  {
    id: "unicode-storage",
    title: "Unicode Storage & Indexing",
    type: "practical",
    description: "Database design for proper Unicode storage and retrieval",
    icon: <Database className="h-4 w-4" />,
    category: "storage",
    difficulty: 3
  },
  {
    id: "encoding-theory",
    title: "Character Encoding Theory",
    type: "theory",
    description: "From ASCII to UTF-8: understanding text encoding",
    icon: <FileText className="h-4 w-4" />,
    category: "storage",
    difficulty: 2
  },
  {
    id: "testing-methodologies",
    title: "UA Testing Methodologies",
    type: "practical",
    description: "Systematic approaches to test applications for UA compliance",
    icon: <CheckList className="h-4 w-4" />,
    category: "testing",
    difficulty: 2
  },
  {
    id: "case-studies",
    title: "UA Implementation Case Studies",
    type: "theory",
    description: "Real-world examples of successful UA implementations",
    icon: <BookOpen className="h-4 w-4" />,
    category: "ua",
    difficulty: 1
  }
];

// Helper function to get category display name
function getCategoryName(categoryId: string): string {
  const categoryNames: Record<string, string> = {
    'idn': 'Internationalized Domain Names',
    'eai': 'Email Address Internationalization',
    'ua': 'Universal Acceptance',
    'storage': 'Data Storage & Processing',
    'testing': 'Testing & Quality Assurance'
  };
  
  return categoryNames[categoryId] || categoryId;
}

// Icon components
function Star(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
}

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

function Briefcase(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );
}

function CheckList(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="10" y1="6" x2="21" y2="6"></line>
      <line x1="10" y1="12" x2="21" y2="12"></line>
      <line x1="10" y1="18" x2="21" y2="18"></line>
      <polyline points="3 6 4 7 6 5"></polyline>
      <polyline points="3 12 4 13 6 11"></polyline>
      <polyline points="3 18 4 19 6 17"></polyline>
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

export default Level5Page;