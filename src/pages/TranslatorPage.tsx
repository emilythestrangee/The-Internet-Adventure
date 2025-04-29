import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Languages } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { translateDocument } from '../services/openaiService';

const TranslatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0); // Track progress as percentage

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError('');
      setProgress(0); // Reset progress on file change
    },
  });

  // Function to split the text into chunks
  const splitTextIntoChunks = (text: string, maxLength: number) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + maxLength, text.length);
      chunks.push(text.slice(start, end));
      start = end;
    }
    return chunks;
  };

  // Function to handle rate limit and retry
  const handleRateLimit = async (chunk: string, targetLanguage: string) => {
    let attempt = 0;
    const maxAttempts = 5;
    let translated = '';

    while (attempt < maxAttempts) {
      try {
        translated = await translateDocument(chunk, targetLanguage);
        break; // Exit loop if successful
      } catch (error) {
        if ((error as any)?.response && (error as any).response.status === 429) {
          attempt++;
          console.log(`Rate limit exceeded. Retrying... (${attempt}/${maxAttempts})`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        } else {
          throw error; // Throw other errors immediately
        }
      }
    }

    if (!translated) {
      throw new Error('Failed to translate chunk after multiple attempts.');
    }
    return translated;
  };

  const handleTranslate = async () => {
    if (!file || !targetLanguage) return;

    setIsLoading(true);
    setError('');
    setTranslatedText('');
    setProgress(0); // Reset progress when starting new translation

    try {
      const text = await file.text();

      // Split text into safe-sized chunks
      const maxChunkLength = 2000; // adjust this if needed
      const chunks = splitTextIntoChunks(text, maxChunkLength);

      const translatedChunks = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const translated = await handleRateLimit(chunk, targetLanguage);
        translatedChunks.push(translated);

        // Update progress based on current chunk index
        const progressPercentage = Math.round(((i + 1) / chunks.length) * 100);
        setProgress(progressPercentage);

        // Optional: wait a little between API calls
        await new Promise((resolve) => setTimeout(resolve, 300)); 
      }

      const fullTranslation = translatedChunks.join('\n\n');
      setTranslatedText(fullTranslation);
    } catch (error) {
      console.error('Translation error:', error);
      setError('Failed to translate the document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <Languages size={24} className="text-blue-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Document Translator</h1>
        </div>

        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          <motion.div
            className={`border-2 border-dashed rounded-xl p-8 text-center ${
              isDragActive ? 'border-blue-400 bg-blue-400/10' : 'border-gray-600'
            }`}
            whileHover={{ scale: 1.01 }}
          >
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300">
              {file
                ? `Selected file: ${file.name}`
                : 'Drag & drop a file here, or click to select'}
            </p>
          </motion.div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-300 mb-2">Target Language</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
          >
            <option value="">Select language</option>
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>

        <motion.button
          onClick={handleTranslate}
          disabled={!file || !targetLanguage || isLoading}
          className={`w-full mt-6 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400
            text-white font-semibold flex items-center justify-center ${
              (!file || !targetLanguage || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          whileHover={(!file || !targetLanguage || isLoading) ? {} : { scale: 1.02 }}
          whileTap={(!file || !targetLanguage || isLoading) ? {} : { scale: 0.98 }}
        >
          {isLoading ? 'Translating...' : 'Translate Document'}
        </motion.button>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-4">
            <p className="text-gray-300">Translating... ({progress}% completed)</p>
            <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
              <div
                className="bg-blue-400 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {translatedText && (
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Translation Result:</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslatorPage;
