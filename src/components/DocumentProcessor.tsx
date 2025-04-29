
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { motion } from 'framer-motion';
// import { Upload, Brain } from 'lucide-react';
// import { trainModel } from '../services/openaiService'; // Import the trainModel function from your service

// const DocumentProcessor: React.FC = () => {
//   const { t } = useTranslation();
//   const [documentContent, setDocumentContent] = useState('');
//   const [processedContent, setProcessedContent] = useState('');
//   const [selectedAction, setSelectedAction] = useState<'train' | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [isModelTrained, setIsModelTrained] = useState(false);

//   // The loadTextFile function to fetch the .txt file content
//   const loadTextFile = async (filePath: string): Promise<string> => {
//     try {
//       const response = await fetch(filePath);
//       if (!response.ok) throw new Error('File not found');
//       const text = await response.text();
//       return text;
//     } catch (error) {
//       console.error('Error loading text file:', error);
//       throw error;
//     }
//   };

//   const loadDocument = async () => {
//     try {
//       const content = await loadTextFile('./telecommunication -1.txt'); // Adjust the path if needed
//       setDocumentContent(content);
//     } catch (error) {
//       setError(t('tools.error'));
//     }
//   };

//   const processDocument = async () => {
//     if (!documentContent || !selectedAction) return;
    
//     setIsProcessing(true);
//     setError('');
    
//     try {
//       let result = '';
//       if (selectedAction === 'train') {
//         result = await trainModel(documentContent); // Train the model with the loaded text
//         setIsModelTrained(true);
//       }
//       setProcessedContent(result);
//     } catch (error) {
//       console.error('Processing error:', error);
//       setError(t('tools.error'));
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-6">
//       <div className="bg-gray-800 rounded-xl p-8">
//         <div>
//           <motion.div
//             className="border-2 border-dashed rounded-xl p-8 text-center"
//             whileHover={{ scale: 1.01 }}
//             onClick={loadDocument} // Load the document when clicked
//           >
//             <Upload size={48} className="mx-auto mb-4 text-gray-400" />
//             <p className="text-gray-300">
//               {documentContent ? 'Document Loaded' : 'Click to load document.txt'}
//             </p>
//           </motion.div>
//         </div>

//         <div className="space-y-4">
//           <button
//             onClick={() => setSelectedAction('train')}
//             className={`p-4 rounded-lg flex items-center justify-center gap-2 ${
//               selectedAction === 'train' ? 'bg-green-500' : 'bg-gray-700'
//             }`}
//           >
//             <Brain size={20} />
//             Train Model
//           </button>

//           <button
//             onClick={processDocument}
//             disabled={isProcessing}
//             className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold disabled:opacity-50"
//           >
//             {isProcessing ? t('tools.processing') : 'Train Model'}
//           </button>

//           {error && (
//             <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
//               <p className="text-red-200">{error}</p>
//             </div>
//           )}

//           {isModelTrained && (
//             <div className="p-4 bg-green-900/50 border border-green-500 rounded-lg">
//               <p className="text-green-200">Model successfully trained!</p>
//             </div>
//           )}

//           {processedContent && (
//             <div className="p-4 bg-gray-700 rounded-lg text-gray-300 min-h-[200px] max-h-[400px] overflow-y-auto">
//               {processedContent}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentProcessor;
// 
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Upload, Brain } from 'lucide-react';
import { sendMessageToOpenAI } from '../services/openaiService'; // Import the sendMessage function

const DocumentProcessor: React.FC = () => {
  const { t } = useTranslation();
  const [documentContent, setDocumentContent] = useState('');
  const [processedContent, setProcessedContent] = useState('');
  const [selectedAction, setSelectedAction] = useState<'train' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isModelTrained, setIsModelTrained] = useState(false);

  // Load the text file from the public directory
  const loadTextFile = async (filePath: string): Promise<string> => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error('File not found');
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Error loading text file:', error);
      throw error;
    }
  };

  const loadDocument = async () => {
    try {
      const content = await loadTextFile('../telecommunication -1.txt'); 
      setDocumentContent(content);
      
    } catch (error) {
      setError(t('tools.error'));
    }
  };

  const processDocument = async () => {
    if (!documentContent || !selectedAction) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      let result = '';
      if (selectedAction === 'train') {
        result = await sendMessageToOpenAI(documentContent, []); // Send the loaded document content for processing
        setIsModelTrained(true);
      }
      setProcessedContent(result);
    } catch (error) {
      console.error('Processing error:', error);
      setError(t('tools.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 rounded-xl p-8">
        <div>
          <motion.div
            className="border-2 border-dashed rounded-xl p-8 text-center"
            whileHover={{ scale: 1.01 }}
            onClick={loadDocument} // Load the document when clicked
          >
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300">
              {documentContent ? 'Document Loaded' : 'Click to load document.txt'}
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setSelectedAction('train')}
            className={`p-4 rounded-lg flex items-center justify-center gap-2 ${selectedAction === 'train' ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <Brain size={20} />
            Train Model
          </button>

          <button
            onClick={processDocument}
            disabled={isProcessing}
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold disabled:opacity-50"
          >
            {isProcessing ? t('tools.processing') : 'Train Model'}
          </button>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {isModelTrained && (
            <div className="p-4 bg-green-900/50 border border-green-500 rounded-lg">
              <p className="text-green-200">Model successfully trained!</p>
            </div>
          )}

          {processedContent && (
            <div className="p-4 bg-gray-700 rounded-lg text-gray-300 min-h-[200px] max-h-[400px] overflow-y-auto">
              {processedContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentProcessor;

