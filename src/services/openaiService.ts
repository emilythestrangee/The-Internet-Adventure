

// import { Message } from '../types/chat';
// import OpenAI from 'openai';

// const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true
// });

// let trainingContext = ''; // Store the training document content

// export const setTrainingContext = (content: string) => {
//   trainingContext = content;
// };


// export const sendMessageToOpenAI = async (content: string, previousMessages: Message[]): Promise<string> => {
//   try {
//     const systemMessage = trainingContext 
//       ? `You are a helpful assistant trained on the following context. Use this information to answer questions accurately: ${trainingContext}`
//       : 'You are a helpful assistant. Reply in the same language the user used.';
      
//     const messages = [
//       { role: 'system', content: systemMessage },
//       ...previousMessages.map(msg => ({
//         role: msg.role,
//         content: msg.content
//       })),
//       { role: 'user', content }
//     ];

//     const response = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: messages as any,
//       temperature: 0.7,
//       max_tokens: 500
//     });

//     return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
//   } catch (error) {
//     console.error('Error calling OpenAI API:', error);
//     throw new Error('Failed to get response from OpenAI');
//   }
// };

// export const translateDocument = async (text: string, targetLanguage: string): Promise<string> => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: [
//         {
//           role: 'system',
//           content: `You are a professional translator. Translate the following text to ${targetLanguage}. Maintain the original formatting and structure.`
//         },
//         {
//           role: 'user',
//           content: text
//         }
//       ],
//       temperature: 0.3,
//       max_tokens: 2000
//     });

//     return response.choices[0]?.message?.content || 'Translation failed.';
//   } catch (error) {
//     console.error('Translation error:', error);
//     throw new Error('Failed to translate document');
//   }
// };

// export const summarizeDocument = async (text: string, language: string): Promise<string> => {
//   try {
//     const systemMessage =
//       language === 'ar'
//         ? 'أنشئ ملخصًا موجزًا وشاملًا للنص التالي. ركز على النقاط الرئيسية والأفكار الأساسية.'
//         : 'Create a concise but comprehensive summary of the following text. Focus on the main points and key takeaways.';
    
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: [
//         {
//           role: 'system',
//           content: systemMessage,
//         },
//         {
//           role: 'user',
//           content: text,
//         },
//       ],
//       temperature: 0.5,
//       max_tokens: 500,
//     });

//     return response.choices[0]?.message?.content || 'Summarization failed.';
//   } catch (error) {
//     console.error('Summarization error:', error);
//     throw new Error('Failed to summarize document');
//   }
// };

// export const answerQuestion = async (document: string, question: string, language: string): Promise<string> => {
//   try {
//     const systemMessage =
//       language === 'ar'
//         ? 'أنت مساعد مفيد. أجب على السؤال استنادًا إلى محتوى الوثيقة المقدمة. إذا لم يكن الجواب موجودًا في الوثيقة، قل ذلك.'
//         : 'You are a helpful assistant. Answer the question based on the provided document content. If the answer cannot be found in the document, say so.';
    
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: [
//         {
//           role: 'system',
//           content: systemMessage,
//         },
//         {
//           role: 'user',
//           content: `Document: ${document}\n\nQuestion: ${question}`,
//         },
//       ],
//       temperature: 0.5,
//       max_tokens: 500,
//     });

//     return response.choices[0]?.message?.content || 'Failed to answer question.';
//   } catch (error) {
//     console.error('Question answering error:', error);
//     throw new Error('Failed to answer question');
//   }
// };

// export const explainTerm = async (term: string, context: string, language: string): Promise<string> => {
//   try {
//     const languageInstructions = language === 'en' 
//       ? 'Provide the explanation in English.' 
//       : language === 'ar'
//       ? 'Provide the explanation in Arabic.'
//       : 'Provide the explanation in English.';

//     const response = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: [
//         {
//           role: 'system',
//           content: `Explain the selected term in the context of the document. If the term appears multiple times, analyze its usage across the document. ${languageInstructions}`
//         },
//         {
//           role: 'user',
//           content: `Term: "${term}"\n\nContext: ${context}`
//         }
//       ],
//       temperature: 0.5,
//       max_tokens: 300
//     });

//     return response.choices[0]?.message?.content || 'Failed to explain term.';
//   } catch (error) {
//     console.error('Term explanation error:', error);
//     throw new Error('Failed to explain term');
//   }
// };


// export const trainModel = async (document: string): Promise<string> => {
//   try {
//     setTrainingContext(document);  // Store the document content for training
//     return 'Model successfully trained with the provided document.';  // Return success message
//   } catch (error) {
//     console.error('Training error:', error);
//     throw new Error('Failed to train the model with the document');
//   }
// };

import { Message } from '../types/chat';
import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

let trainingContext = ''; // Store the training document content
let documentChunks: string[] = []; // Store chunks of the document

// Function to split text into chunks
const splitIntoChunks = (text: string, maxWordsPerChunk = 200): string[] => {
  const words = text.split(' ');
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += maxWordsPerChunk) {
    const chunk = words.slice(i, i + maxWordsPerChunk).join(' ');
    chunks.push(chunk);
  }

  return chunks;
};

// Store the document content and prepare chunks
export const setTrainingContext = (content: string) => {
  trainingContext = content;
  documentChunks = splitIntoChunks(content, 200); // Split content into chunks of 200 words each
};

// Send message to OpenAI with the relevant chunk
export const sendMessageToOpenAI = async (content: string, previousMessages: Message[]): Promise<string> => {
  try {
    const systemMessage = trainingContext 
      ? `You are a helpful assistant trained on the following context. Use this information to answer questions accurately: ${trainingContext}` 
      : 'You are a helpful assistant. Reply in the same language the user used.';
    
    // Find the most relevant chunk for the user's question
    const relevantChunk = findMostRelevantChunk(content);

    const messages = [
      { role: 'system', content: systemMessage },
      ...previousMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: relevantChunk + "\n" + content } // Combine the chunk with the user's question
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get response from OpenAI');
  }
};

// Function to find the most relevant chunk (basic keyword match)
const findMostRelevantChunk = (question: string): string => {
  // Simple search logic: You can replace this with more advanced methods like cosine similarity if needed.
  let bestMatch = documentChunks[0];
  let highestMatchScore = 0;

  documentChunks.forEach(chunk => {
    const matchScore = chunk.split(' ').filter(word => question.includes(word)).length;
    if (matchScore > highestMatchScore) {
      highestMatchScore = matchScore;
      bestMatch = chunk;
    }
  });

  return bestMatch;
};

// Translate document to a target language
export const translateDocument = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${targetLanguage}. Maintain the original formatting and structure.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    return response.choices[0]?.message?.content || 'Translation failed.';
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate document');
  }
};

// Summarize document
export const summarizeDocument = async (text: string, language: string): Promise<string> => {
  try {
    const systemMessage =
      language === 'ar'
        ? 'أنشئ ملخصًا موجزًا وشاملًا للنص التالي. ركز على النقاط الرئيسية والأفكار الأساسية.'
        : 'Create a concise but comprehensive summary of the following text. Focus on the main points and key takeaways.';
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Summarization failed.';
  } catch (error) {
    console.error('Summarization error:', error);
    throw new Error('Failed to summarize document');
  }
};

// Answer a question based on the document
export const answerQuestion = async (document: string, question: string, language: string): Promise<string> => {
  try {
    const systemMessage =
      language === 'ar'
        ? 'أنت مساعد مفيد. أجب على السؤال استنادًا إلى محتوى الوثيقة المقدمة. إذا لم يكن الجواب موجودًا في الوثيقة، قل ذلك.'
        : 'You are a helpful assistant. Answer the question based on the provided document content. If the answer cannot be found in the document, say so.';
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: `Document: ${document}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Failed to answer question.';
  } catch (error) {
    console.error('Question answering error:', error);
    throw new Error('Failed to answer question');
  }
};

// Explain a term in the context of the document
export const explainTerm = async (term: string, context: string, language: string): Promise<string> => {
  try {
    const languageInstructions = language === 'en' 
      ? 'Provide the explanation in English.' 
      : language === 'ar'
      ? 'Provide the explanation in Arabic.' 
      : 'Provide the explanation in English.';

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Explain the selected term in the context of the document. If the term appears multiple times, analyze its usage across the document. ${languageInstructions}`
        },
        {
          role: 'user',
          content: `Term: "${term}"\n\nContext: ${context}`
        }
      ],
      temperature: 0.5,
      max_tokens: 300
    });

    return response.choices[0]?.message?.content || 'Failed to explain term.';
  } catch (error) {
    console.error('Term explanation error:', error);
    throw new Error('Failed to explain term');
  }
};

// Train the model with the provided document
export const trainModel = async (document: string): Promise<string> => {
  try {
    setTrainingContext(document);  // Store the document content for training
    return 'Model successfully trained with the provided document.';  // Return success message
  } catch (error) {
    console.error('Training error:', error);
    throw new Error('Failed to train the model with the document');
  }
};
