


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MessageSquare } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { summarizeDocument, answerQuestion } from '../services/openaiService';

const SummarizerPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState('');
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en'); // Default language is English

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError('');
      try {
        const text = await acceptedFiles[0].text();
        setDocumentText(text);
        handleSummarize(text);
      } catch (error) {
        console.error('File reading error:', error);
        setError('Failed to read the file. Please try again.');
      }
    },
  });

  // Function to handle summarization of the document
  const handleSummarize = async (text: string) => {
    setIsLoading(true);
    setError('');
    try {
      const summary = await summarizeDocument(text, language);
      setSummary(summary);
    } catch (error) {
      console.error('Summarization error:', error);
      setError('Failed to summarize the document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle asking a question about the document
  const handleAskQuestion = async () => {
    if (!question.trim() || !documentText) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await answerQuestion(documentText, question, language);
      setAnswer(response);
    } catch (error) {
      console.error('Question answering error:', error);
      setError('Failed to get an answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect hook to re-fetch the summary whenever the language changes
  useEffect(() => {
    if (documentText) {
      handleSummarize(documentText);
    }
  }, [language, documentText]); // Re-run the summarization whenever language or documentText changes

  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto px-4 py-8 bg-gray-900">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-300 hover:text-white mb-8"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Tools
      </button>

      <div className="bg-gray-800 rounded-xl p-8">
        <div className="flex items-center mb-6">
          <MessageSquare size={24} className="text-purple-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Smart Summarizer & Chatbot</h1>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="text-gray-300 mr-4">Select Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:border-purple-400 focus:ring focus:ring-purple-400/20"
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </div>

        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          <motion.div
            className={`border-2 border-dashed rounded-xl p-8 text-center ${
              isDragActive ? 'border-purple-400 bg-purple-400/10' : 'border-gray-600'
            }`}
            whileHover={{ scale: 1.01 }}
          >
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300">
              {file ? `Selected file: ${file.name}` : 'Drag & drop a file here, or click to select'}
            </p>
          </motion.div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {isLoading && !error && (
          <div className="mt-4 flex justify-center">
            <div className="loader">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        {summary && (
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Document Summary:</h3>
            <p className="text-gray-300">{summary}</p>
          </div>
        )}

        {documentText && (
          <div className="mt-8">
            <h3 className="text-white font-semibold mb-4">Ask Questions About the Document</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the document..."
                className="flex-1 bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-purple-400 focus:ring focus:ring-purple-400/20"
              />
              <motion.button
                onClick={handleAskQuestion}
                disabled={!question.trim() || isLoading}
                className={`px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-400
                  text-white font-semibold ${
                    !question.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                whileHover={!question.trim() || isLoading ? {} : { scale: 1.02 }}
                whileTap={!question.trim() || isLoading ? {} : { scale: 0.98 }}
              >
                Ask
              </motion.button>
            </div>
          </div>
        )}

        {answer && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Answer:</h3>
            <p className="text-gray-300">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarizerPage;
