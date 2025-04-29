import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Search } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import { explainTerm } from '../services/openaiService';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.2.133/es5/build/pdf.worker.min.js';

const ExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [explanation, setExplanation] = useState('');
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
      try {
        setFile(acceptedFiles[0]);

        if (acceptedFiles[0].type === 'application/pdf') {
          const text = await extractTextFromPDF(acceptedFiles[0]);
          setDocumentContent(text);
        } else {
          const text = await acceptedFiles[0].text();
          setDocumentContent(text);
        }
        setError('');
      } catch (error) {
        console.error('File reading error:', error);
        setError('Failed to read the file. Please try again.');
      }
    },
  });

  const extractTextFromPDF = async (pdfFile: File) => {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result;
          if (arrayBuffer instanceof ArrayBuffer) {
            console.log('PDF loaded as ArrayBuffer.');
            
            // Load the PDF document
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            console.log(`PDF loaded with ${pdf.numPages} pages.`);
  
            let textContent = '';
            // Loop through each page and extract text
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const content = await page.getTextContent();
              console.log(`Extracting text from page ${pageNum}...`);
  
              // Collect text from each item
              content.items.forEach((item: any) => {
                textContent += item.str;
              });
            }
  
            // Check if any text was extracted
            if (textContent.trim() === '') {
              console.log('No extractable text found in this PDF.');
              reject('No extractable text found in this PDF.');
            } else {
              resolve(textContent);
            }
          } else {
            reject('Failed to load PDF as ArrayBuffer');
          }
        } catch (error) {
          console.error('Error extracting text from PDF:', error);
          reject('Error extracting text from PDF');
        }
      };
  
      // Attempt to read the file as an ArrayBuffer
      reader.readAsArrayBuffer(pdfFile);
    });
  };

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;

    const selectedText = selection.toString().trim();
    setSelectedText(selectedText);

    setIsLoading(true);
    setError('');
    try {
      const explanation = await explainTerm(selectedText, documentContent, language); // Send the language preference
      setExplanation(explanation);
    } catch (error) {
      console.error('Explanation error:', error);
      setError('Failed to get explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleNewFileUpload = () => {
    setFile(null);
    setDocumentContent('');
    setSelectedText('');
    setExplanation('');
  };

  // Watch for language changes and trigger explanation again if necessary
  useEffect(() => {
    if (selectedText) {
      handleTextSelection(); // Re-run the explanation process when language changes
    }
  }, [language]); // Depend on language change

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
          <Search size={24} className="text-amber-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Interactive Document Explorer</h1>
        </div>

        {/* Upload Section */}
        {!file && (
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <motion.div
              className={`border-2 border-dashed rounded-xl p-8 text-center ${
                isDragActive ? 'border-amber-400 bg-amber-400/10' : 'border-gray-600'
              }`}
              whileHover={{ scale: 1.01 }}
            >
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300">Drag & drop a file here, or click to select</p>
            </motion.div>
          </div>
        )}

        {/* Button to upload a new file */}
        {file && (
          <div className="mt-4">
            <button
              onClick={handleNewFileUpload}
              className="bg-amber-400 text-white p-2 rounded-lg"
            >
              Upload a new document
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Document Content */}
        {documentContent && (
          <div className="mt-6">
            <div
              className="p-4 bg-gray-700 rounded-lg text-gray-300 min-h-[200px] max-h-[400px] overflow-y-auto"
              onMouseUp={handleTextSelection}
            >
              {documentContent}
            </div>
            <p className="text-sm text-gray-400 mt-2">Select any text to get an explanation</p>
          </div>
        )}

        {/* Language Selection */}
        <div className="mt-4">
          <label className="text-white">Select Language for Explanation: </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="ml-2 bg-gray-600 text-gray-300 p-2 rounded-md"
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            {/* Add more languages here if needed */}
          </select>
        </div>

        {/* Loading Indicator */}
        {isLoading && !error && (
          <div className="mt-4 flex justify-center">
            <div className="loader">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Explanation Section */}
        {explanation && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Explanation for "{selectedText}":</h3>
            <p className="text-gray-300">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorerPage;
