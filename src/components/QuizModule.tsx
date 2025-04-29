import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Check, X, ChevronRight, Award } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizModuleProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
  onComplete: () => void;
}

const QuizModule: React.FC<QuizModuleProps> = ({
  title,
  description,
  questions,
  onComplete
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  
  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent changing answer after selection
    
    setSelectedOption(optionIndex);
    const correct = optionIndex === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setQuizCompleted(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };
  
  const currentQuestionData = questions[currentQuestion];
  const passingScore = Math.ceil(questions.length * 0.7); // 70% to pass
  const passed = score >= passingScore;
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      
      <div className="p-6">
        <AnimatePresence mode="wait">
          {!quizCompleted ? (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-primary-600">
                    Score: {score}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-primary-600 h-1.5 rounded-full" 
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestionData.question}
              </h3>
              
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
                    className={`w-full text-left p-4 rounded-lg border transition-colors flex justify-between items-center ${
                      selectedOption === index 
                        ? index === currentQuestionData.correctAnswer 
                          ? 'bg-green-50 border-green-500 text-green-900' 
                          : 'bg-red-50 border-red-500 text-red-900'
                        : selectedOption !== null && index === currentQuestionData.correctAnswer
                          ? 'bg-green-50 border-green-500 text-green-900'
                          : 'bg-white border-gray-300 text-gray-800 hover:border-primary-500'
                    }`}
                    onClick={() => handleOptionSelect(index)}
                    disabled={selectedOption !== null}
                  >
                    <span>{option}</span>
                    {selectedOption !== null && (
                      index === currentQuestionData.correctAnswer ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : selectedOption === index ? (
                        <X className="h-5 w-5 text-red-600" />
                      ) : null
                    )}
                  </motion.button>
                ))}
              </div>
              
              {selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-4 p-4 rounded-lg ${
                    isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  <div className="flex items-start">
                    {isCorrect ? (
                      <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">
                        {isCorrect ? 'Correct!' : 'Incorrect!'}
                      </p>
                      <p className="mt-1 text-sm">
                        {currentQuestionData.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="quiz-complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-6">
                {passed ? (
                  <Award className="h-16 w-16 text-primary-600" />
                ) : (
                  <X className="h-16 w-16 text-red-600" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {passed ? 'Congratulations!' : 'Nice try!'}
              </h3>
              
              <p className="text-lg mb-4">
                You scored {score} out of {questions.length}
                {passed ? ' and passed the challenge!' : '.'}
              </p>
              
              {!passed && (
                <p className="text-gray-600 mb-6">
                  You need {passingScore} points to pass. Would you like to try again?
                </p>
              )}
              
              {passed && (
                <p className="text-green-600 mb-6">
                  You've earned the badge for this level!
                </p>
              )}
              
              <div className="flex justify-center space-x-4">
                {!passed && (
                  <button
                    className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                    onClick={() => {
                      setCurrentQuestion(0);
                      setSelectedOption(null);
                      setIsCorrect(null);
                      setScore(0);
                      setQuizCompleted(false);
                    }}
                  >
                    Try Again
                  </button>
                )}
                
                <button
                  className="btn btn-primary"
                  onClick={onComplete}
                >
                  {passed ? 'Claim Your Badge' : 'Continue'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {selectedOption !== null && !quizCompleted && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            className="btn btn-primary flex items-center"
            onClick={handleNextQuestion}
          >
            <span>{currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}</span>
            <ChevronRight className="ml-1 h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizModule;